import React, { useState, useEffect, useRef } from "react";
import "./Visiual.css"; // Stil dosyası

const colors = ["red", "green", "purple", "orange", "brown", "cyan", "blue",
   "black", "maroon", "lime", "navy", "olive", "teal", "silver", "yellow", "aqua", "fuchsia", "gray" ];

function Visiual({ OrderArray: OrderArray }) {
  const [colorMap, setColorMap] = useState({});
  const colorUsageCountRef = useRef({});

  useEffect(() => {
    const uniqueCustomers = new Set();
    OrderArray.forEach((group) => {
      group.slice(0, -1).forEach((item) => {
        uniqueCustomers.add(item.customer_id);
      });
    });

    const newColorMap = {};
    let colorIndex = 0;
    uniqueCustomers.forEach((customer_id) => {
      newColorMap[customer_id] = colors[colorIndex % colors.length];
      colorIndex++;
    });

    setColorMap(newColorMap);

    const initialColorUsageCount = Array.from(uniqueCustomers).reduce(
      (acc, customer_id) => {
        acc[customer_id] = 0;
        return acc;
      },
      {}
    );

    colorUsageCountRef.current = initialColorUsageCount;
  }, [OrderArray]);

  const resetUsageCounts = () => {
    const resetCounts = { ...colorUsageCountRef.current };
    Object.keys(resetCounts).forEach((customer_id) => {
      resetCounts[customer_id] = 0;
    });
    colorUsageCountRef.current = resetCounts;
  };

  const incrementUsageCount = (customer_id) => {
    const currentCount = 1 + colorUsageCountRef.current[customer_id]++;
    return currentCount;
  };

  return (
    <div className="visualization">
      <div className="scroll-container">
        {OrderArray.map((group, groupIndex) => (
          <div key={`group-${groupIndex}`} className="row">
            {group.slice(0, -1).map((item, itemIndex) => {
              const customerColor = colorMap[item.customer_id];

              if (itemIndex === 0 && groupIndex === 0) {
                resetUsageCounts();
              }

              return (
                <div key={`item-${itemIndex}`} className="element-container">
                  {Array.from({ length: item.used_quantity }).map(
                    (_, quantityIndex) => {
                      const currentUsageCount = incrementUsageCount(
                        item.customer_id
                      );
                      return (
                        <div
                          key={`quantity-${quantityIndex}`}
                          className="rectangle"
                          style={{
                            width: `${item.length}px`,
                            height: "60px",
                            backgroundColor: customerColor,
                            margin: "0px",
                          }}
                        >
                          {item.length}mm | ID: {item.customer_id} | #
                          {currentUsageCount}
                        </div>
                      );
                    }
                  )}
                </div>
              );
            })}
            <div className="remaining">
              <div
                className="rectangle remaining-rectangle"
                style={{
                  width: `${group[group.length - 1].remaining}px`,
                  height: "60px",
                  backgroundColor: "gray",
                  margin: "0px",
                }}
              >
                Kalan: {group[group.length - 1].remaining}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visiual;
