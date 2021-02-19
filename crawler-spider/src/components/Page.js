import React from "react";

export default ({ data }) => {
  return (
    <div className="page-container">
      <div className="title-container">
        <h4>{data.title}</h4>
      </div>
      <div className="info-container">
        <label htmlFor="" className="info-title">
          Depth:
        </label>
        <div>{data.depth}</div>
      </div>
      <div className="info-container">
        <label htmlFor="" className="info-title">
          Url:
        </label>
        <a className="link" href={data.url}>
          <span>{data.url}</span>
        </a>
      </div>
      <div className="info-container">
        <label htmlFor="" className="info-title">
          links
        </label>
        <div className="links-container">
          {data.links &&
            data.links.map((link) => (
              <a className="link" href={link}>
                <span> {link}</span>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};
