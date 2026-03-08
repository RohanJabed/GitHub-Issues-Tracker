const createElements = (arr) => {
    const htmlElements = arr.map((arr) => `<span class="badge bg-[#FDE68A] text-yellow-600">${arr}</span>`);
    return (htmlElements.join(' '))
}

const loadModal = (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    fetch(url)
        .then(res => res.json())
        .then(json => showModal(json.data))

}
const showModal = (issue) => {
    document.getElementById("modals").innerHTML = `
        <div class="space-y-6">

    <!-- Title -->
    <h2 class="text-3xl font-bold">${issue.title}</h2>

    <!-- Status Row -->
    <div class="flex items-center gap-3 text-sm text-gray-500">
        <span class="badge ${issue.status === "open" ? "bg-green-500" : "bg-purple-500"} ">${issue.status === "open" ? "Open" : "Closed"}</span>
        <span>Opened by ${issue.author}</span>
        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
    </div>

    <!-- Labels -->
    <div class="flex gap-3">
         ${createElements(issue.labels)}
    </div>

    <!-- Description -->
    <p class="text-gray-600">
        ${issue.description}
    </p>

    <!-- Assignee & Priority -->
    <div class="flex justify-between bg-base-200 p-6 rounded-xl">

        <div>
            <p class="text-gray-500">Assignee:</p>
            <h3 class="text-lg font-semibold">${issue.assignee ? issue.assignee :
            "No name found"}</h3>
        </div>

        <div>
            <p class="text-gray-500">Priority:</p>
            <span class="badge badge-error badge-lg">${issue.priority}</span>
        </div>

    </div>

    <!-- Close Button -->
    <div class="modal-action">
        <form method="dialog">
            <button class="btn btn-primary">Close</button>
        </form>
    </div>

</div>
    
    
    `

    document.getElementById("issue_modal").showModal();
}

const ManageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden")
        document.getElementById("cards").classList.add("hidden")
    }
    else {
        document.getElementById("spinner").classList.add("hidden")

        document.getElementById("cards").classList.remove("hidden")

    }
}


const loadData = () => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    fetch(url)
        .then(res => res.json())
        .then(json => {
            displayData(json.data)
            OpenBtn(json.data)
            CloseBtn(json.data)
            AllBtn(json.data)
        })
}


const AllBtn = (all) => {
    const btnAll = document.getElementById("all-btn");
    btnAll.addEventListener("click", function () {
        ManageSpinner(true);
        const buttons = document.querySelectorAll("#button-sections button");
        buttons.forEach(b => b.classList.remove("active"));
        btnAll.classList.add("active");

        const openContainer = document.getElementById('cards');
        openContainer.innerHTML = '';
        const openCount = document.getElementById('count');
        openCount.innerText = `${all.length} Issues`;

        setTimeout(() => {
            displayData(all);
            ManageSpinner(false);
        }, 300);
    })
}
const OpenBtn = (open) => {
    const openBtn = document.getElementById('open-btn');
    openBtn.addEventListener('click', function () {
        ManageSpinner(true);
        const buttons = document.querySelectorAll("#button-sections button");
        buttons.forEach(b => b.classList.remove("active"));
        openBtn.classList.add("active");

        const openContainer = document.getElementById('cards');
        openContainer.innerHTML = '';
        const openIssues = open.filter(open => open.status === 'open');
        const openCount = document.getElementById('count');
        openCount.innerText = `${openIssues.length} Issues`;

        setTimeout(() => {
            displayData(openIssues);
            ManageSpinner(false);
        }, 300);
    })
}
const CloseBtn = (closed) => {
    const btnClosed = document.getElementById("closed-btn");
    btnClosed.addEventListener("click", function () {
        ManageSpinner(true);
        const buttons = document.querySelectorAll("#button-sections button");
        buttons.forEach(b => b.classList.remove("active"));
        btnClosed.classList.add("active");

        const openContainer = document.getElementById('cards');
        openContainer.innerHTML = '';
        const closedIssues = closed.filter(closed => closed.status === 'closed');
        const openCount = document.getElementById('count');
        openCount.innerText = `${closedIssues.length} Issues`;

        setTimeout(() => {
            displayData(closedIssues);
            ManageSpinner(false);
        }, 300);
    })
}


const displayData = (data) => {
    // console.log(data)
    const allContainer = document.getElementById("cards");
    for (const issues of data) {
        // console.log(issues)
        const div = document.createElement("div");
        div.innerHTML = `
              <div class="card bg-base-100 shadow-sm cursor-pointer relative h-full border-t-4  ${issues.status === "open" ? "border-green-500" : "border-purple-500"}">
                <span class="badge badge-warning absolute top-4 right-4">${issues.priority}</span>
                <div class="card-body space-y-3">
                    <h2 class="card-title pr-16">${issues.title}</h2>
                    <p class="text-[#64748B]">${issues.description}</p>
                    <div class="border-b border-gray-300 pb-3 mb-3">
                        ${createElements(issues.labels)}
                    </div>
                    <div class="text-sm text-gray-600 space-y-3">
                        <p>#1 by ${issues.author}</p>
                        <p>${new Date(issues.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `;
        div.addEventListener("click", () => {
            loadModal(issues.id);
        });

        allContainer.appendChild(div);
    }
}

document.getElementById("btn-search").addEventListener("click", () => {

    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            ManageSpinner(true);
            const issues = data.data;

            const container = document.getElementById("cards");
            const count = document.getElementById("count");

            container.innerHTML = "";

            if (issues.length === 0) {

                container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center p-9 bg-red-200 rounded-md">
                    <img class="mx-auto" src="./assets/alert-error.png" alt="">
                    <h1 class="text-center text-2xl font-bold mt-4">No Issue Available</h1>
                </div>
                `;

                count.innerText = "0 Issues";

            } else {

                displayData(issues);
                count.innerText = `${issues.length} Issues`;

            }
            setTimeout(() => {
                ManageSpinner(false);
            }, 300);

        });

    input.value = "";
    const buttons = document.querySelectorAll("#button-sections button");
    buttons.forEach(b => b.classList.remove("active"));



});


loadData();