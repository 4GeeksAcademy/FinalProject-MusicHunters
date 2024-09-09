import React from "react";
import PropTypes from "prop-types";

const Modal = ({
  isOpen,
  onClose,
  title,
  imageUrl,
  date,
  place,
  genre,
  prices,
  buyUrls,
  description,
}) => {
  if (!isOpen) return null;

  const formatPrices = (prices, urls) => {
    if (
      !Array.isArray(prices) ||
      !Array.isArray(urls) ||
      prices.length !== urls.length
    ) {
      return null;
    }

    return prices.map((price, index) => (
      <option key={index} value={urls[index]}>
        {price}
      </option>
    ));
  };

  const handleSelectChange = (event) => {
    const selectedUrl = event.target.value;
    if (selectedUrl) {
      window.open(selectedUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <img src={imageUrl} alt={title} />
            <div className="modal-details">
              <p>
                <strong>
                  <i className="far fa-calendar"></i>
                </strong>{" "}
                {date}
              </p>
              <p>
                <strong>
                  <i className="fas fa-map-marker-alt"></i>
                </strong>{" "}
                {place}
              </p>
              <p>
                <strong>
                  <i className="fas fa-music"></i>
                </strong>{" "}
                {genre}
              </p>
              <p>
                <strong>
                  <i className="fas fa-euro-sign"></i>
                </strong>{" "}
                <select onChange={handleSelectChange}>
                  <option className="mt-1" value="">
                    Select a price
                  </option>
                  {formatPrices(prices, buyUrls)}
                </select>
              </p>
              <p>{description || "No description available."}</p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-warning" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  date: PropTypes.string,
  place: PropTypes.string,
  genre: PropTypes.string,
  prices: PropTypes.array,
  buyUrls: PropTypes.array,
  description: PropTypes.string,
};

export default Modal;
