from flask import Flask, request, jsonify
import pulp
from itertools import product

app = Flask(__name__)

def generate_patterns(roll_length, customer_demands):
    lengths = [] # List to store the lengths of the demands
    for demand in customer_demands: # Iterate over the demands
        lengths.append(demand[1]) # Append the length of the demand to the list
    
    max_pieces = {} # Dictionary to store the maximum number of pieces that can be cut from a roll
    for length in lengths: # Iterate over the lengths
        max_pieces[length] = roll_length // length # Calculate the maximum number of pieces that can be cut from a roll 
    
    patterns = [] #example: [((1, 2, 3), 100), ((2, 1, 3), 200), ...] 
    # List to store the valid patterns and their leftover lengths
    
    ranges = [] #example: [range(4), range(3), range(2)]
    for length in lengths:
        max_piece_count = int(max_pieces[length]) + 1 # we add 1 to the max_piece_count because range function is exclusive
        ranges.append(range(max_piece_count)) # Append the range of possible number of pieces for the current length to the ranges list

    # Iterate over all possible combinations of the number of pieces
    for num_pieces_combination in product(*ranges):
        #product(*ranges) returns the cartesian product of the ranges
    
        # Calculate the total length of the current combination
        total_length = 0
        for num_pieces, length in zip(num_pieces_combination, lengths):
            #it returns a tuple of the same length as the number of ranges
            #zip(num_pieces_combination, lengths) returns [(num_pieces1, length1), (num_pieces2, length2), ...]
            total_length += num_pieces * length

        # Check if the total length is within the roll length and greater than 0
        if 0 < total_length <= roll_length:
            leftover = roll_length - total_length
            patterns.append((num_pieces_combination, leftover)) # Append the valid pattern and the leftover length to the patterns list
            # tuple of the number of pieces for each length example: (1, 2, 3) left over length is the remaining length of the roll after cutting the pieces
            
    return patterns # Return the valid patterns and their leftover lengths

def optimize_cutting(roll_length, customer_demands):
    # Group customer demands by length #it is a dictionary with the length as the key and a list of tuples as the value
    # example with 2 customer id of same length: {length: [(customer_id, quantity), (customer_id, quantity)]}
    grouped_demands = {} # example: {length: [(customer_id, quantity)]}
    
    for customer_id, length, quantity in customer_demands:
        # If the length is not already a key in the dictionary, add it
        if length not in grouped_demands:
            grouped_demands[length] = []
        
        # Append the customer ID and quantity to the list for this le
        grouped_demands[length].append((customer_id, quantity)) # example: {length: [(customer_id, quantity)]} for 1 customer id of same length 
    
    # Initialize an empty dictionary to store the flattened demands example: {length: total_quantity}
    flattened_demands = {} # example: {length: total_quantity} for all customers of same length
    
    # Iterate over each length and its corresponding demands in the grouped_demands dictionary
    for length, demands in grouped_demands.items(): # example: {length: [(customer_id, quantity)]} second is a list of tuples so we can iterate over it
        # Calculate the total quantity for the current length
        total_quantity = 0 
        for _, quantity in demands:
            total_quantity += quantity
        
        # Store the total quantity in the flattened_demands dictionary
        flattened_demands[length] = total_quantity # example: {length: total_quantity}
    
    patterns_with_leftovers = generate_patterns(roll_length, customer_demands) # HAS EXPLANATION ABOVE
    num_patterns = len(patterns_with_leftovers) # Get the number of different patterns
    problem = pulp.LpProblem("Cutting_Stock_Problem", pulp.LpMinimize) # Define the problem as a minimization problem
    pattern_vars = [pulp.LpVariable(f'pattern_{i}', lowBound=0, cat = 'Integer') for i in range(num_patterns)] # Define the variables and store them in a list
    
    problem += pulp.lpSum(pattern_vars) # Objective function: minimize the total number of patterns used
    for length_index, (length, demand) in enumerate(flattened_demands.items()): # Add constraints for each length
        problem += pulp.lpSum(pattern_vars[i] * patterns_with_leftovers[i][0][length_index] for i in range(num_patterns)) >= demand
        # Add the constraint that the total demand for the current length must be satisfied
    
    problem.solve() # Solve the problem WE WERE HERE YESTERDAY
    
    if pulp.LpStatus[problem.status] == 'Optimal':  # If the problem is solved successfully
        results = [] # add the results to this list

        for pattern_index, pattern_var in enumerate(pattern_vars):
            if pattern_var.varValue > 0:  # If the pattern is used more than 0 times
                pattern = patterns_with_leftovers[pattern_index][0] # Get the pattern
                for _ in range(int(pattern_var.varValue)): # Iterate over the number of times the pattern is used varValue built-in attribute of the pulp.LpVariable class
                    result = []
                    remaining_roll_length = roll_length # Initialize the remaining roll length
                    for length, num_pieces in zip(flattened_demands.keys(), pattern): # Iterate over the lengths and the number of pieces in the pattern
                        if num_pieces > 0: # If the number of pieces is greater than 0
                            remaining_demand = num_pieces 
                            for customer_id, quantity in grouped_demands[length]:
                                if quantity > 0: # If the quantity is greater than 0
                                    used_quantity = min(quantity, remaining_demand) # Calculate the used quantity
                                    remaining_demand -= used_quantity # Update the remaining demand
                                    remaining_roll_length -= used_quantity * length
                                    result.append({ #its like json object, python dictionary, key-value pair, later we will convert it to json
                                        'used_quantity': used_quantity,
                                        'length': length,
                                        'customer_id': customer_id
                                    })
                                    # Update the grouped_demands with the reduced quantity
                                    grouped_demands[length] = [
                                        (cust_id, qty) if cust_id != customer_id else (cust_id, qty - used_quantity) # Update the quantity
                                        for cust_id, qty in grouped_demands[length]
                                    ]
                    result.append({'remaining': remaining_roll_length}) # Append the remaining roll length to the result as a last element
                    #example of result: [{'used_quantity': 1, 'length': 1, 'customer_id': '1'}, {'used_quantity': 2, 'length': 2, 'customer_id': '2'}, {'remaining': 1000}]
                    results.append(result) # Append the result to the results list
        return results
    return None # Return None if the problem is not solved 'Optimal'

@app.route('/your-flask-endpoint', methods=['POST'])
def your_flask_endpoint():
    customer_demands = []
    data = request.get_json()
    if 'orderList' in data:
        order_list = data['orderList']
        roll_length = data['roll_length']
        for order in order_list:
            customer_id = str(order.get('customername'))
            length = int(order.get('size'))
            quantity = int(order.get('unit'))
            
            if customer_id is not None and length is not None and quantity is not None:
                customer_demands.append((customer_id, length, quantity))
        
        results = optimize_cutting(roll_length, customer_demands)
        order_list = []
        return jsonify(results), 200
    else:
        return jsonify({'error': 'orderList eksik!'}), 400

if __name__ == '__main__':
    app.run(port=3002, debug=True)