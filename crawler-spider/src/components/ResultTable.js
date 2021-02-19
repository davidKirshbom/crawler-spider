import React from "react";
import Page from "./Page";

export default ({ data, numberOfColumns }) => {
  return (
    <div className="result-container">
      {(function () {
        let rows = [];
        for (let i = 0; i <= numberOfColumns; i++)
          rows.push(
            <div id={`row-${i}`} className="row">
              {data
                .filter((page) => page.depth === i)
                .map((page, i) => (
                  <Page data={page} />
                ))}
            </div>
          );
        return rows;
      })()}
    </div>
  );
};
