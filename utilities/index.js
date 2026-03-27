const invModel = require("../models/inventory-model")

const Util = {}

/* NAV */
Util.getNav = async function () {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/">Home</a></li>'

    data.rows.forEach(row => {
        list += `<li>
            <a href="/inv/type/${row.classification_id}">
            ${row.classification_name}
            </a>
        </li>`
    })

    list += "</ul>"
    return list
}

/* ERROR HANDLER */
Util.handleErrors = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

/* CLASSIFICATION GRID */
Util.buildClassificationGrid = function (data) {
    let grid = ""

    if (data.length > 0) { 
        grid = '<ul id="inv-display">'

        data.forEach(vehicle => {
            grid += `
            <li>
                <a href="/inv/detail/${vehicle.inv_id}">
                    <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
                </a>
                <div class="namePrice">
                    <h2>
                        <a href="/inv/detail/${vehicle.inv_id}">
                        ${vehicle.inv_make} ${vehicle.inv_model}
                        </a>
                    </h2>
                    <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
                </div>
            </li>`
        })

        grid += "</ul>"
    } else {
        grid = '<p class="notice">No vehicles found.</p>'
    }

    return grid
}

/* VEHICLE DETAIL */
Util.buildVehicleDetail = function (data) {
  return `
  <div class="vehicle-detail">

    <!-- LEFT: Image + thumbnails -->
    <div class="vehicle-image-section">
      <div class="image-wrapper">
        <div class="certified-badge">
          <span class="badge-check">✔</span>
          <span class="badge-text">This vehicle has passed inspection<br>by an ASE-certified technician.</span>
          <span class="badge-logo">enterprise certified®</span>
        </div>
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}" class="main-image">
      </div>
      <div class="thumbnail-strip">
        <img src="${data.inv_thumbnail}" alt="thumb 1">
        <img src="${data.inv_thumbnail}" alt="thumb 2">
        <img src="${data.inv_thumbnail}" alt="thumb 3">
        <img src="${data.inv_thumbnail}" alt="thumb 4">
      </div>
    </div>

    <!-- RIGHT: Info panel -->
    <div class="vehicle-info">
      <h1 class="vehicle-title">
        ${data.inv_year} ${data.inv_make} ${data.inv_model}
      </h1>

      <!-- Price row with mileage badge -->
      <div class="price-row">
        <div class="mileage-badge">
          <span class="mileage-label">MILEAGE</span>
          <span class="mileage-value">${new Intl.NumberFormat('en-US').format(data.inv_miles)}</span>
        </div>
        <div class="price-block">
          <p class="no-haggle-label">No-Haggle Price <sup>1</sup></p>
          <p class="price">$${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
          <p class="price-note">Does not include $299 Dealer Documentary Service Fee.</p>
          <a href="#" class="estimate-link">ESTIMATE PAYMENTS</a>
        </div>
      </div>

      <!-- Specs list -->
      <ul class="specs-list">
        <li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</li>
        <li><strong>MPG:</strong> N/A</li>
        <li><strong>Ext. Color:</strong> ${data.inv_color}</li>
        <li><strong>Int. Color:</strong> Unknown</li>
        <li><strong>Fuel Type:</strong> Gasoline</li>
        <li><strong>Drivetrain:</strong> Front Wheel Drive</li>
        <li><strong>Transmission:</strong> CVT</li>
        <li><strong>Stock #:</strong> N/A</li>
        <li><strong>VIN:</strong> ${data.inv_id}</li>
      </ul>

      <!-- Action buttons -->
      <div class="action-buttons">
        <button class="btn-primary">START MY PURCHASE</button>
        <button class="btn-outline">CONTACT US</button>
        <button class="btn-outline">🚗 SCHEDULE TEST DRIVE</button>
        <button class="btn-outline">APPLY FOR FINANCING</button>
      </div>

      <div class="contact-info">
        <p><strong>Call Us</strong><br>801-396-7886</p>
      </div>
    </div>

  </div>`
}

module.exports = Util