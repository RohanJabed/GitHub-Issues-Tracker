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
        <span class="badge ${issue.status === "open" ? "bg-green-500" : "bg-purple-500"} ">${issue.status === "open" ? "Open"  : "Closed"}</span>
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
        const openContainer = document.getElementById('cards');
        openContainer.innerHTML = '';
        const openCount = document.getElementById('count');
        openCount.innerText = `${all.length} Issues`;
        displayData(all)
    })
}
const OpenBtn = (open) => {
    const openBtn = document.getElementById('open-btn');
    openBtn.addEventListener('click', function () {
        const openContainer = document.getElementById('cards');
        openContainer.innerHTML = '';
        const openIssues = open.filter(open => open.status === 'open');
        const openCount = document.getElementById('count');
        openCount.innerText = `${openIssues.length} Issues`;
        // console.log(openIssues)
        displayData(openIssues)
    })
}
const CloseBtn = (closed) => {
    const btnClosed = document.getElementById("closed-btn");
    btnClosed.addEventListener("click", function () {
        const openContainer = document.getElementById('cards');
        openContainer.innerHTML = '';
        const closedIssues = closed.filter(closed => closed.status === 'closed');
        const openCount = document.getElementById('count');
        openCount.innerText = `${closedIssues.length} Issues`;
        // console.log(openIssues)
        displayData(closedIssues)
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
loadData();