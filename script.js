// ==========================================
// LIBRARY MANAGEMENT SYSTEM
// USING RELATIONS IN MATHEMATICS
// ==========================================


// MEMBERS

const members = [
  "M1",
  "M2",
  "M3",
  "M4",
  "M5"
];


// BOOKS

const books = [
  "B1",
  "B2",
  "B3",
  "B4",
  "B5"
];


// RELATION R

const relation = [
  ["M1", "B2"],
  ["M1", "B4"],

  ["M2", "B1"],
  ["M2", "B3"],

  ["M3", "B2"],
  ["M3", "B5"],

  ["M5", "B4"]
];


// SHORT SELECTOR

const $ = (selector) =>
  document.querySelector(selector);


// MULTIPLE SELECTOR

const $$ = (selector) =>
  document.querySelectorAll(selector);


// ==========================================
// CREATE MEMBER / BOOK CHIPS
// ==========================================

function createChips(selector, items) {

  $(selector).innerHTML =
    items.map(item => {

      return `
        <span class="chip">
          ${item}
        </span>
      `;

    }).join("");
}


createChips("#memberChips", members);

createChips("#bookChips", books);


// ==========================================
// RELATION PAIR LIST
// ==========================================

$("#pairList").innerHTML =
  relation.map((pair, index) => {

    return `
      <div
        class="pair"
        data-index="${index}"
      >
        (${pair[0]}, ${pair[1]})
      </div>
    `;

  }).join("");


// ==========================================
// NETWORK DIAGRAM
// ==========================================

function buildNetwork() {

  $("#networkMembers").innerHTML =
    members.map(member => {

      return `
        <div
          class="network-node"
          data-node="${member}"
        >
          ${member}
        </div>
      `;

    }).join("");


  $("#networkBooks").innerHTML =
    books.map(book => {

      return `
        <div
          class="network-node book"
          data-node="${book}"
        >
          ${book}
        </div>
      `;

    }).join("");


  const svg = $("#networkSvg");


  const memberY = {

    M1: 40,
    M2: 118,
    M3: 196,
    M4: 274,
    M5: 352

  };


  const bookY = {

    B1: 40,
    B2: 118,
    B3: 196,
    B4: 274,
    B5: 352

  };


  svg.innerHTML =
    relation.map((pair, index) => {

      const member = pair[0];

      const book = pair[1];


      return `
        <path
          data-edge="${index}"
          d="
            M 10 ${memberY[member]}
            C 160 ${memberY[member]},
              300 ${bookY[book]},
              640 ${bookY[book]}
          "
        ></path>
      `;

    }).join("");
}


buildNetwork();


// ==========================================
// HIGHLIGHT RELATION
// ==========================================

function highlightRelation(index) {

  // Remove previous pair highlight

  $$(".pair").forEach(pair => {

    pair.classList.remove("active");

  });


  const selectedPair =
    $(`.pair[data-index="${index}"]`);


  if (selectedPair) {

    selectedPair.classList.add("active");

  }


  // Remove previous nodes

  $$(".network-node").forEach(node => {

    node.classList.remove("active");

  });


  // Remove previous lines

  $$("[data-edge]").forEach(edge => {

    edge.classList.remove("active");

  });


  // Current relation

  const [member, book] =
    relation[index];


  // Highlight member

  $$(`[data-node="${member}"]`)
    .forEach(node =>
      node.classList.add("active")
    );


  // Highlight book

  $$(`[data-node="${book}"]`)
    .forEach(node =>
      node.classList.add("active")
    );


  // Highlight line

  const edge =
    $(`[data-edge="${index}"]`);


  if (edge) {

    edge.classList.add("active");

  }
}


// ==========================================
// PAIR CLICK
// ==========================================

$$(".pair").forEach(pair => {

  pair.addEventListener(
    "click",
    () => {

      const index =
        Number(pair.dataset.index);

      highlightRelation(index);

    }
  );

});


// ==========================================
// NETWORK NODE CLICK
// ==========================================

$$(".network-node").forEach(node => {

  node.addEventListener(
    "click",
    () => {

      const selected =
        node.dataset.node;


      const index =
        relation.findIndex(
          pair =>
            pair.includes(selected)
        );


      if (index >= 0) {

        highlightRelation(index);

      }

    }
  );

});


// ==========================================
// MEMBER DATA
// ==========================================

const memberData =
  members.map(member => {

    const borrowedBooks =
      relation
        .filter(pair =>
          pair[0] === member
        )
        .map(pair =>
          pair[1]
        );


    let status;


    if (borrowedBooks.length === 0) {

      status = "Inactive";

    }

    else if (borrowedBooks.length > 1) {

      status = "Multiple";

    }

    else {

      status = "Single";

    }


    return {

      member: member,

      books: borrowedBooks,

      count: borrowedBooks.length,

      status: status

    };

  });


// ==========================================
// MEMBER TABLE
// ==========================================

$("#memberTable").innerHTML =
  memberData.map(data => {

    return `
      <tr>

        <td>
          <b>${data.member}</b>
        </td>

        <td>
          ${
            data.books.length
            ? data.books.join(", ")
            : "None"
          }
        </td>

        <td>
          ${data.count}
        </td>

        <td
          class="
            status-${data.status.toLowerCase()}
          "
        >
          ${data.status}
        </td>

      </tr>
    `;

  }).join("");


// ==========================================
// CHART FUNCTION
// ==========================================

function createChart(
  selector,
  data,
  maximum
) {

  $(selector).innerHTML =
    data.map(item => {

      const height =
        Math.max(
          10,
          (item.value / maximum) * 205
        );


      return `
        <div class="bar-group">

          <span class="bar-value">
            ${item.value}
          </span>

          <div
            class="bar"
            style="height:${height}px"
          ></div>

          <span class="bar-label">
            ${item.label}
          </span>

        </div>
      `;

    }).join("");
}


// ==========================================
// MEMBER CHART
// ==========================================

createChart(

  "#memberChart",

  memberData.map(item => {

    return {

      label: item.member,

      value: item.count

    };

  }),

  2

);


// ==========================================
// BOOK DATA
// ==========================================

const bookData =
  books.map(book => {

    return {

      label: book,

      value:
        relation.filter(
          pair =>
            pair[1] === book
        ).length

    };

  });


// ==========================================
// BOOK CHART
// ==========================================

createChart(
  "#bookChart",
  bookData,
  2
);


// ==========================================
// CARTESIAN PRODUCT TABLE
// ==========================================

$("#cartesianTable").innerHTML = `

  <thead>

    <tr>

      <th>M × B</th>

      ${
        books.map(book =>
          `<th>${book}</th>`
        ).join("")
      }

    </tr>

  </thead>


  <tbody>

    ${
      members.map(member => {

        return `

          <tr>

            <th>
              ${member}
            </th>

            ${
              books.map(book => {

                const isRelation =
                  relation.some(
                    pair =>
                      pair[0] === member &&
                      pair[1] === book
                  );


                return `

                  <td
                    class="
                      ${
                        isRelation
                        ? "hit"
                        : ""
                      }
                    "
                  >
                    (${member}, ${book})
                  </td>

                `;

              }).join("")
            }

          </tr>

        `;

      }).join("")
    }

  </tbody>

`;


// ==========================================
// SCROLL PROGRESS
// ==========================================

const progressLine =
  $("#progressLine");


window.addEventListener(
  "scroll",
  () => {

    const pageHeight =
      document.documentElement
        .scrollHeight
      -
      window.innerHeight;


    const progress =
      (
        window.scrollY /
        pageHeight
      ) * 100;


    progressLine.style.width =
      progress + "%";

  }
);


// ==========================================
// DARK MODE
// ==========================================

$("#themeBtn").addEventListener(
  "click",
  () => {

    document.body
      .classList
      .toggle("dark");


    if (
      document.body
        .classList
        .contains("dark")
    ) {

      $("#themeBtn")
        .textContent = "☀";

    }

    else {

      $("#themeBtn")
        .textContent = "☾";

    }

  }
);


// ==========================================
// MOBILE MENU
// ==========================================

$("#menuBtn").addEventListener(
  "click",
  () => {

    $("#mainNav")
      .classList
      .toggle("open");

  }
);


$$("#mainNav a").forEach(link => {

  link.addEventListener(
    "click",
    () => {

      $("#mainNav")
        .classList
        .remove("open");

    }
  );

});


// ==========================================
// PRINT / SAVE PDF
// ==========================================

$("#printBtn").addEventListener(
  "click",
  () => {

    window.print();

  }
);


// ==========================================
// PRESENTATION MODE
// ==========================================

$("#presentationBtn")
  .addEventListener(
    "click",
    () => {

      document.body
        .classList
        .toggle("presentation");


      showToast(

        document.body
          .classList
          .contains("presentation")

          ? "Presentation mode ON"

          : "Presentation mode OFF"

      );

    }
  );


// ==========================================
// TOAST MESSAGE
// ==========================================

function showToast(message) {

  const toast =
    $("#toast");


  toast.textContent =
    message;


  toast.style.display =
    "block";


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(
      () => {

        toast.style.display =
          "none";

      },
      1800
    );

}