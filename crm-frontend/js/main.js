document.addEventListener("DOMContentLoaded", () => {
  // HASH Ссылка на страницу
  window.addEventListener("hashchange", async function () {
    const openedModal = document.querySelector(".modal");
    if (openedModal) {
      closeModal(openedModal);
    }

    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const client = await findClientHash(hash);
      openModal(createUpdateClientModal(client));

      const tableRows = document.querySelectorAll("tr");
      for (let tableRow of tableRows) {
        for (let cell of tableRow.cells) {
          if (cell.innerHTML === client.id.substring(client.id.length - 6))
            tableRow.classList.add("clients__tr-delete");
        }
      }
    }
  });

  async function findClientHash(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const client = await response.json();
    return client;
  }

  // ПРЕЛОУДЕР
  window.onload = function () {
    const preloader = document.querySelector(".preloader");
    preloader.classList.add("loaded_hiding");
    window.setTimeout(function () {
      preloader.classList.add("loaded");
      preloader.classList.remove("loaded_hiding");
    }, 3000);
  };

  createPreloader = () => {
    const preloaderBlock = document.createElement("div");
    const preloaderSpinner = document.createElement("div");
    preloaderBlock.classList.add("preloader");
    preloaderSpinner.classList.add("spinner");

    preloaderBlock.append(preloaderSpinner);

    return preloaderBlock;
  };

  createBtnPreloader = () => {
    const preloaderBlock = document.createElement("div");
    const preloaderSpinner = document.createElement("div");
    preloaderBlock.classList.add("btn-preloader");
    preloaderSpinner.classList.add("btn-spinner");

    preloaderBlock.append(preloaderSpinner);

    return preloaderBlock;
  };

  // РЕНДЕР ТАБЛИЦЫ
  async function getClientsList() {
    const response = await fetch("http://localhost:3000/api/clients");
    const clientsList = await response.json();
    renderClientsTable(clientsList);
  }

  getClientsList();

  function renderClientsTable(clientsArray) {
    const tableBody = document.querySelector("#table tbody");
    tableBody.classList.add("clients__tbody");
    tableBody.innerHTML = " ";

    for (const clientObj of clientsArray) {
      const newTableRow = createClientElement(clientObj);
      tableBody.append(newTableRow);
    }
  }

  // ТАБЛИЦА

  function createTable() {
    const tableContainer = document.querySelector(".clients__table");
    const table = document.createElement("table");
    const tableHead = createTableHead();
    const tableBody = document.createElement("tbody");

    tableBody.append(createPreloader());
    table.append(tableHead, tableBody);
    tableContainer.append(table);
    table.classList.add("clients__table-data");
    table.setAttribute("id", "table");
  }

  createTable();

  function createTableHead() {
    const tableHeadRow = document.createElement("tr");
    const idHeader = document.createElement("th");
    const idHeaderInner = document.createElement("div");
    const fullNameHeader = document.createElement("th");
    const fullNameHeaderInner = document.createElement("div");
    const createdAtHeader = document.createElement("th");
    const createdAtHeaderInner = document.createElement("div");
    const updatedAtHeader = document.createElement("th");
    const updatedAtHeaderInner = document.createElement("div");
    const contactsHeader = document.createElement("th");
    const actionsHeader = document.createElement("th");

    idHeader.classList.add("clients__th", "clients__id");
    idHeader.dataset.id = true;
    idHeaderInner.classList.add("clients__th-id");
    fullNameHeader.classList.add("clients__th", "clients__full-name");
    fullNameHeader.dataset.fullname = true;
    fullNameHeaderInner.classList.add("clients__th-full-name");
    createdAtHeader.classList.add("clients__th", "clients__created-at");
    createdAtHeader.dataset.created = true;
    createdAtHeaderInner.classList.add("clients__th-created-at");
    updatedAtHeader.classList.add("clients__th", "clients__updated-at");
    updatedAtHeader.dataset.updated = true;
    updatedAtHeaderInner.classList.add("clients__th-updated-at");
    contactsHeader.classList.add("clients__th");
    actionsHeader.classList.add("clients__th");

    idHeader.role = "button";
    fullNameHeader.role = "button";
    createdAtHeader.role = "button";
    updatedAtHeader.role = "button";
    contactsHeader.role = "button";
    actionsHeader.role = "button";

    idHeaderInner.textContent = "ID";
    fullNameHeaderInner.textContent = `Фамилия Имя Отчество`;
    createdAtHeaderInner.textContent = "Дата и время создания";
    updatedAtHeaderInner.textContent = "Последние изменения";
    contactsHeader.textContent = "Контакты";
    actionsHeader.textContent = "Действия";

    idHeader.append(idHeaderInner);
    fullNameHeader.append(fullNameHeaderInner);
    createdAtHeader.append(createdAtHeaderInner);
    updatedAtHeader.append(updatedAtHeaderInner);

    tableHeadRow.append(
      idHeader,
      fullNameHeader,
      createdAtHeader,
      updatedAtHeader,
      contactsHeader,
      actionsHeader
    );
    tableHeadRow.classList.add("clients__head-tr");
    return tableHeadRow;
  }

  function formatDate(date) {
    let currentDate = new Date(date);
    let result =
      currentDate.getDate() < 10
        ? "0" + currentDate.getDate() + "."
        : currentDate.getDate() + ".";
    result =
      result +
      (currentDate.getMonth() < 9
        ? "0" + (currentDate.getMonth() + 1) + "."
        : currentDate.getMonth() + 1 + ".");
    result = result + currentDate.getFullYear();

    return result;
  }

  function formatTime(time) {
    const date = new Date(time);

    let hours;
    let minutes;

    if (date.getHours() < 10) {
      hours = `0${date.getHours()}`;
    } else {
      hours = date.getHours();
    }

    if (date.getMinutes() < 10) {
      minutes = `0${date.getMinutes()}`;
    } else {
      minutes = date.getMinutes();
    }

    const result = hours + ":" + minutes;

    return result;
  }

  function createContactIcon(contactObj) {
    const iconLink = document.createElement("a");
    iconLink.classList.add("tbody__link");

    const svgPhone = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
            <circle cx="8" cy="8" r="8" fill="#9873FF" />
            <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white" />
        </g>
    </svg>`;

    const svgEmail = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF" />
    </svg>`;

    const svgVk = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
            <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF" />
        </g>
    </svg>`;

    const svgFacebook = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
            <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF" />
        </g>
    </svg>`;

    const svgOther = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF" />
    </svg>`;

    switch (contactObj.type) {
      case "Телефон":
        iconLink.href = `tel:${contactObj.value}`;
        iconLink.innerHTML = svgPhone;
        break;
      case "Email":
        iconLink.href = `mailto:${contactObj.value}`;
        iconLink.innerHTML = svgEmail;
        break;
      case "Vk":
        iconLink.href = `VK:${contactObj.value}`;
        iconLink.innerHTML = svgVk;
        break;
      case "Facebook":
        iconLink.href = `Facebook:${contactObj.value}`;
        iconLink.innerHTML = svgFacebook;
        break;
      case "Другое":
        iconLink.href = `Facebook:${contactObj.value}`;
        iconLink.innerHTML = svgOther;
    }

    tippy(iconLink, {
      content: `<span>${contactObj.type}:<a href"#"><b>${contactObj.value}</b></a></span>`,
      allowHTML: true,
      interactive: true,
    });

    return iconLink;
  }

  // создаем кнопку +num
  function createMoreBtn(num) {
    const moreBtn = document.createElement("button");
    const moreBtnSpan = document.createElement("span");
    moreBtn.classList.add("btn", "moreBtn");
    moreBtnSpan.classList.add("moreBtnSpan");
    moreBtnSpan.textContent = `+${num}`;
    moreBtn.append(moreBtnSpan);
    return moreBtn;
  }

  function createClientElement(clientObj) {
    const tableRow = document.createElement("tr");
    const tdID = document.createElement("td");
    const tdFullName = document.createElement("td");
    const tdCreatedAt = document.createElement("td");
    const spanCreatedDate = document.createElement("span");
    const spanCreatedTime = document.createElement("span");
    const tdUpdatedAt = document.createElement("td");
    const spanUpdatedDate = document.createElement("span");
    const spanUpdatedTime = document.createElement("span");
    const tdContacts = document.createElement("td");
    const tdContactsWrapper = document.createElement("div");
    const tdActions = document.createElement("td");
    const tdActionsWrapper = document.createElement("div");
    const deleteButton = document.createElement("button");
    const updateButton = document.createElement("button");
    const spanUpdateButtonSvg = document.createElement("span");
    const spanUpdateButtonTxt = document.createElement("span");
    const spanUpdateButtonPreloader = createBtnPreloader();

    tdID.classList.add("clients__td", "clients__id");
    tdFullName.classList.add("clients__td", "clients__full-name");
    tdCreatedAt.classList.add(
      "clients__td",
      "clients__created-at",
      "clients__created-at-td"
    );
    spanCreatedDate.classList.add("clients__date-span");
    spanCreatedTime.classList.add("clients__time-span");
    tdUpdatedAt.classList.add(
      "clients__td",
      "clients__updated-at",
      "clients__updated-at-td"
    );
    spanUpdatedDate.classList.add("clients__date-span");
    spanUpdatedTime.classList.add("clients__time-span");
    tdContacts.classList.add("clients__td");
    tdContactsWrapper.classList.add("clients__td-contacts");
    tdActions.classList.add("clients__td");
    tdActionsWrapper.classList.add("clients__td-actions");
    deleteButton.classList.add("btn-reset", "clients__delete-btn");
    updateButton.classList.add("btn-reset", "clients__update-btn");
    tableRow.classList.add("clients__tr");
    spanUpdateButtonSvg.classList.add("clients__span-svg");
    spanUpdateButtonTxt.classList.add("clients__span-txt");

    const contactsElems = clientObj.contacts.map((contact) =>
      createContactIcon(contact)
    );
    tdContactsWrapper.append(...contactsElems);

    if (contactsElems.length > 4) {
      const hiddenContacts = contactsElems.slice(4);
      hiddenContacts.forEach((item) => item.classList.add("hide"));
      const moreBtn = createMoreBtn(hiddenContacts.length);
      tdContactsWrapper.append(moreBtn);

      moreBtn.addEventListener("click", () => {
        hiddenContacts.forEach((item) => item.classList.remove("hide"));
        moreBtn.remove();
      });
    }

    tdID.textContent = clientObj.id.substring(clientObj.id.length - 6);
    tdFullName.textContent = `${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`;
    spanCreatedDate.textContent = formatDate(clientObj.createdAt);
    spanCreatedTime.textContent = formatTime(clientObj.createdAt);
    spanUpdatedDate.textContent = formatDate(clientObj.updatedAt);
    spanUpdatedTime.textContent = formatTime(clientObj.updatedAt);

    const editSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g opacity="0.7" clip-path="url(#clip0_216_242)">
  <path d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z" fill="#9873FF"/>
  </g>
  <defs>
  <clipPath id="clip0_216_242">
  <rect width="16" height="16" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;
    const deleteSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g opacity="0.7" clip-path="url(#clip0_216_247)">
  <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2   5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8   8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
  </g>
  <defs>
  <clipPath id="clip0_216_247">
  <rect width="16" height="16" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;

    spanUpdateButtonSvg.innerHTML = `${editSvg}`;
    spanUpdateButtonTxt.innerHTML = `Изменить`;
    spanUpdateButtonPreloader;

    updateButton.append(
      spanUpdateButtonPreloader,
      spanUpdateButtonSvg,
      spanUpdateButtonTxt
    );

    // updateButton.innerHTML = `${editSvg} Изменить`;
    deleteButton.innerHTML = `${deleteSvg} Удалить`;

    tdCreatedAt.append(spanCreatedDate, spanCreatedTime);
    tdUpdatedAt.append(spanUpdatedDate, spanUpdatedTime);
    tdActionsWrapper.append(updateButton, deleteButton);
    tdActions.append(tdActionsWrapper);
    tdContacts.append(tdContactsWrapper);
    tableRow.append(
      tdID,
      tdFullName,
      tdCreatedAt,
      tdUpdatedAt,
      tdContacts,
      tdActions
    );

    spanUpdateButtonPreloader.classList.add("loaded");

    updateButton.addEventListener("click", function () {
      spanUpdateButtonPreloader.classList.remove("loaded");
      spanUpdateButtonSvg.classList.add("hide");

      setTimeout(function () {
        spanUpdateButtonPreloader.classList.add("loaded_hiding");
        spanUpdateButtonSvg.classList.remove("hide");
        spanUpdateButtonPreloader.classList.remove("loaded_hiding");
        spanUpdateButtonPreloader.classList.add("loaded");
      }, 1000);
      const modal = createUpdateClientModal(clientObj);
      openModal(modal);
      tableRow.classList.add("clients__tr-delete");
    });

    deleteButton.addEventListener("click", function () {
      tableRow.classList.add("clients__tr-delete");
      openModalDelete(createDeleteClientModal(clientObj));
    });

    return tableRow;
  }

  // МОДАЛЬНОЕ ОКНО СОЗДАТЬ КЛИЕНТА

  const sectionClients = document.querySelector(".clients");
  const btnAddClient = document.querySelector(".clients__btn-client");

  function openModalDelete(modal) {
    sectionClients.append(modal);
    setTimeout(() => {
      modal.showModal();
      modal.classList.add("modal__delete-open");
    }, 300);

    return modal;
  }

  function openModal(modal) {
    sectionClients.append(modal);
    setTimeout(() => {
      modal.showModal();
      modal.classList.add("open");
    }, 300);

    return modal;
  }

  function closeModal(modal) {
    modal.classList.remove("open");
    setTimeout(() => {
      modal.close();
      modal.remove();
    }, 300);
  }

  function createModalAddClient() {
    const form = createForm();
    const modal = document.createElement("dialog");
    const modalContent = document.createElement("div");

    modal.classList.add("modal");
    modalContent.classList.add("modal__content");

    modalContent.append(form.title, form.form, form.btnCloseModal);

    modal.append(modalContent);

    form.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validation(form.form)) {
        const newClient = {
          surname: form.inputSurname.value.trim(),
          name: form.inputName.value.trim(),
          lastName: form.inputLastName.value.trim(),
          contacts: getContacts(),
        }; /* собираем объект из значений в полях ввода  */

        await addClientToServer(newClient);

        const resp = await fetch("http://localhost:3000/api/clients");
        const clientsList = await resp.json();
        renderClientsTable(clientsList);
        form.form.reset();

        closeModal(modal);
      }
    });

    form.btnCloseModal.addEventListener("click", () => {
      closeModal(modal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target == modal) closeModal(modal);
    });

    return modal;
  }

  async function addClientToServer(obj) {
    const response = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return await response.json();
  }

  function createForm() {
    const title = document.createElement("h2");
    const form = document.createElement("form");
    const modalWrapper = document.createElement("div");
    const modalWrapperSurname = document.createElement("div");
    const modalWrapperName = document.createElement("div");
    const modalWrapperLastName = document.createElement("div");
    const wrapperBtn = document.createElement("div");
    const contactsListElement = document.createElement("ul");
    const fieldSurname = document.createElement("div");
    const fieldName = document.createElement("div");
    const fieldLastName = document.createElement("div");
    const inputSurname = document.createElement("input");
    const inputName = document.createElement("input");
    const inputLastName = document.createElement("input");
    const labelSurname = document.createElement("label");
    const labelSurnameStar = document.createElement("span");
    const labelName = document.createElement("label");
    const labelNameStar = document.createElement("span");
    const labelLastName = document.createElement("label");
    const contactsBlock = document.createElement("div");
    const btnAddContact = document.createElement("button");
    const btnSave = document.createElement("button");
    const btnCancel = document.createElement("button");
    const btnCloseModal = document.createElement("button");

    btnAddContact.addEventListener("click", () => {
      addContact(contactsListElement, btnAddContact, contactsBlock);
    });

    title.classList.add("modal__title", "title");
    form.classList.add("modal__form");
    modalWrapper.classList.add("modal__blank", "flex");
    modalWrapperSurname.classList.add("modal__wrapper");
    modalWrapperName.classList.add("modal__wrapper");
    modalWrapperLastName.classList.add("modal__wrapper");
    fieldSurname.classList.add("modal__floating");
    fieldName.classList.add("modal__floating");
    fieldLastName.classList.add("modal__floating");
    inputSurname.classList.add("modal__input", "modal__input-surname");
    inputName.classList.add("modal__input", "modal__input-name");
    inputLastName.classList.add("modal__input", "modal__input-lastname");
    labelSurname.classList.add("modal__label");
    labelSurnameStar.classList.add("modal__label-star");
    labelName.classList.add("modal__label");
    labelNameStar.classList.add("modal__label-star", "modal__label-star-name");
    labelLastName.classList.add("modal__label");
    contactsBlock.classList.add("modal__contacts", "contacts", "flex");
    btnAddContact.classList.add("btn-reset", "contacts__btn");
    btnSave.classList.add("btn-reset", "modal__save");
    wrapperBtn.classList.add("modal__action", "flex");
    btnCancel.classList.add("btn-reset", "modal__cancel");
    btnCloseModal.classList.add("btn-reset", "modal__close");
    contactsListElement.classList.add("contacts__list", "flex");

    inputSurname.type = "input";
    inputName.type = "input";
    inputLastName.type = "input";

    inputSurname.name = "surname";
    inputName.name = "name";
    inputLastName.name = "lastName";

    inputSurname.setAttribute("data-required", "true");
    inputName.setAttribute("data-required", "true");
    inputLastName.setAttribute("data-required", "true");

    inputSurname.setAttribute("data-max-length", "15");
    inputName.setAttribute("data-max-length", "15");
    inputLastName.setAttribute("data-max-length", "15");

    title.textContent = "Новый клиент";
    labelSurname.textContent = "Фамилия";
    labelSurnameStar.innerHTML = `<?xml version="1.0" encoding="utf-8"?>
<svg width="10px" height="10px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet"><linearGradient id="IconifyId17ecdb2904d178eab5645" gradientUnits="userSpaceOnUse" x1="64.002" y1="100.076" x2="64.002" y2="28.635"><stop offset=".485" stop-color="#504f4f"></stop><stop offset="1" stop-color="#757575"></stop></linearGradient><path d="M50.92 67.87L29.87 61.8c-1.04-.3-1.62-1.4-1.29-2.43l3.38-10.39a1.914 1.914 0 0 1 2.51-1.19l20.78 8.04c1.29.5 2.66-.49 2.6-1.87L56.81 30c-.05-1.09.82-2 1.91-2h11.05c1.09 0 1.96.91 1.91 2l-1.05 24.48c-.06 1.38 1.32 2.36 2.6 1.87l20.34-7.87c1.03-.4 2.18.16 2.52 1.21l3.34 10.62c.32 1.03-.27 2.12-1.3 2.41l-21.48 6.09a1.92 1.92 0 0 0-1.01 2.99L89.6 90.38c.64.85.46 2.06-.4 2.69l-8.96 6.55c-.9.66-2.16.41-2.75-.53L65.05 79.2c-.75-1.19-2.48-1.2-3.23-.02L49.55 98.41c-.59.92-1.82 1.16-2.71.54l-9.01-6.29a1.916 1.916 0 0 1-.43-2.73l14.5-19.06c.83-1.07.32-2.62-.98-3z" fill="url(#IconifyId17ecdb2904d178eab5645)"></path></svg>`;
    labelName.textContent = "Имя";
    labelNameStar.innerHTML = `<?xml version="1.0" encoding="utf-8"?>
<svg width="10px" height="10px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet"><linearGradient id="IconifyId17ecdb2904d178eab5645" gradientUnits="userSpaceOnUse" x1="64.002" y1="100.076" x2="64.002" y2="28.635"><stop offset=".485" stop-color="#504f4f"></stop><stop offset="1" stop-color="#757575"></stop></linearGradient><path d="M50.92 67.87L29.87 61.8c-1.04-.3-1.62-1.4-1.29-2.43l3.38-10.39a1.914 1.914 0 0 1 2.51-1.19l20.78 8.04c1.29.5 2.66-.49 2.6-1.87L56.81 30c-.05-1.09.82-2 1.91-2h11.05c1.09 0 1.96.91 1.91 2l-1.05 24.48c-.06 1.38 1.32 2.36 2.6 1.87l20.34-7.87c1.03-.4 2.18.16 2.52 1.21l3.34 10.62c.32 1.03-.27 2.12-1.3 2.41l-21.48 6.09a1.92 1.92 0 0 0-1.01 2.99L89.6 90.38c.64.85.46 2.06-.4 2.69l-8.96 6.55c-.9.66-2.16.41-2.75-.53L65.05 79.2c-.75-1.19-2.48-1.2-3.23-.02L49.55 98.41c-.59.92-1.82 1.16-2.71.54l-9.01-6.29a1.916 1.916 0 0 1-.43-2.73l14.5-19.06c.83-1.07.32-2.62-.98-3z" fill="url(#IconifyId17ecdb2904d178eab5645)"></path></svg>`;
    labelLastName.textContent = "Отчество";

    btnAddContact.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_224_3502)">
<path d="M7.99998 4.66671C7.63331 4.66671 7.33331 4.96671 7.33331 5.33337V7.33337H5.33331C4.96665 7.33337 4.66665 7.63337 4.66665 8.00004C4.66665 8.36671 4.96665 8.66671 5.33331 8.66671H7.33331V10.6667C7.33331 11.0334 7.63331 11.3334 7.99998 11.3334C8.36665 11.3334 8.66665 11.0334 8.66665 10.6667V8.66671H10.6666C11.0333 8.66671 11.3333 8.36671 11.3333 8.00004C11.3333 7.63337 11.0333 7.33337 10.6666 7.33337H8.66665V5.33337C8.66665 4.96671 8.36665 4.66671 7.99998 4.66671ZM7.99998 1.33337C4.31998 1.33337 1.33331 4.32004 1.33331 8.00004C1.33331 11.68 4.31998 14.6667 7.99998 14.6667C11.68 14.6667 14.6666 11.68 14.6666 8.00004C14.6666 4.32004 11.68 1.33337 7.99998 1.33337ZM7.99998 13.3334C5.05998 13.3334 2.66665 10.94 2.66665 8.00004C2.66665 5.06004 5.05998 2.66671 7.99998 2.66671C10.94 2.66671 13.3333 5.06004 13.3333 8.00004C13.3333 10.94 10.94 13.3334 7.99998 13.3334Z" fill="#9873FF"/>
</g>
<defs>
<clipPath id="clip0_224_3502">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
Добавить контакт`;

    btnAddContact.type = "button";
    btnSave.textContent = "Сохранить";
    btnCancel.textContent = "Отмена";
    btnCancel.type = "button";
    btnCloseModal.innerHTML = `
  <svg width="17" height="17" viewBox="0 0 17 17" fill="CurrentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z" />
  </svg>`;

    inputSurname.append(labelSurname);
    labelSurname.append(labelSurnameStar);
    fieldSurname.append(inputSurname, labelSurname);
    modalWrapperSurname.append(fieldSurname);
    inputName.append(labelName);
    labelName.append(labelNameStar);
    fieldName.append(inputName, labelName);
    modalWrapperName.append(fieldName);
    inputLastName.append(labelLastName);
    fieldLastName.append(inputLastName, labelLastName);
    modalWrapperLastName.append(fieldLastName);
    contactsBlock.append(contactsListElement, btnAddContact);
    modalWrapper.append(
      modalWrapperSurname,
      modalWrapperName,
      modalWrapperLastName
    );
    wrapperBtn.append(btnSave, btnCancel);
    form.append(modalWrapper, contactsBlock, wrapperBtn);

    inputSurname.addEventListener("input", () => {
      labelSurname.classList.add("modal__label-up");
      if (inputSurname.value.trim() === "") {
        labelSurname.classList.remove("modal__label-up");
      }
    });

    inputName.addEventListener("input", () => {
      labelName.classList.add("modal__label-name-up");
      if (inputName.value.trim() === "") {
        labelName.classList.remove("modal__label-name-up");
      }
    });

    inputLastName.addEventListener("input", () => {
      labelLastName.classList.add("modal__label-up");
      if (inputLastName.value.trim() === "") {
        labelLastName.classList.remove("modal__label-up");
      }
    });

    btnCancel.addEventListener("click", () => {
      form.reset();
      labelSurname.classList.remove("modal__label-up");
      labelName.classList.remove("modal__label-name-up");
      labelLastName.classList.remove("modal__label-up");
    });

    return {
      title,
      btnCloseModal,
      form,
      contactsListElement,
      btnAddContact,
      contactsBlock,
      inputSurname,
      labelSurname,
      inputName,
      labelName,
      inputLastName,
      labelLastName,
      btnSave,
      btnCancel,
    };
  }

  btnAddClient.addEventListener("click", () => {
    openModal(createModalAddClient());
  });

  // КОНТАКТЫ

  function getContacts() {
    const contacts = [];
    const contactsTypes = document.querySelectorAll(".contacts__select");
    const contactsValues = document.querySelectorAll(".contacts__input");

    for (let i = 0; i < contactsValues.length; i++) {
      contacts.push({
        type: contactsTypes[i].value,
        value: contactsValues[i].value,
      });
    }
    return contacts;
  }

  function addContact(
    contactsListElement,
    btnAddContact,
    contactsBlock,
    contact = null
  ) {
    const itemContact = createItemContact(
      contactsListElement,
      btnAddContact,
      contactsBlock
    );

    if (contact) {
      itemContact.select.value = contact.type;
      itemContact.contactInp.value = contact.value;
    }

    contactsListElement.append(itemContact.item);
    contactsListElement.classList.add("contacts__list-toggle");
    contactsBlock.classList.add("modal__contacts-toggle");

    if (!itemContact.select.classList.contains("choice")) {
      const choices = new Choices(itemContact.select, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
        allowHTML: true,
      });
    }

    if (contactsListElement.childElementCount >= 10) {
      btnAddContact.style.display = "none";
    }
  }

  function removeContact(
    item,
    contactsListElement,
    btnAddContact,
    contactsBlock
  ) {
    item.remove();

    if (contactsListElement.childElementCount < 10) {
      btnAddContact.style.display = "block";
    }

    if (contactsListElement.childElementCount === 0) {
      contactsListElement.classList.remove("contacts__list-toggle");
      contactsBlock.classList.remove("modal__contacts-toggle");
    }
  }

  function createItemContact(
    contactsListElement,
    btnAddContact,
    contactsBlock
  ) {
    const item = document.createElement("li");
    const select = document.createElement("select");
    const optionTel = document.createElement("option");
    const optionEmail = document.createElement("option");
    const optionVk = document.createElement("option");
    const optionFb = document.createElement("option");
    const optionOther = document.createElement("option");
    const contactInpWrapper = document.createElement("div");
    const contactInp = document.createElement("input");
    const btnDelContact = document.createElement("button");

    item.classList.add("contacts__item", "flex");
    select.classList.add("contacts__select", "js-choice");
    optionTel.classList.add("contacts__option");
    optionEmail.classList.add("contacts__option");
    optionVk.classList.add("contacts__option");
    optionFb.classList.add("contacts__option");
    optionOther.classList.add("contacts__option");
    contactInp.classList.add("contacts__input");
    contactInpWrapper.classList.add("contacts__input-wrapper");
    btnDelContact.classList.add("contacts__del-btn", "btn-reset", "flex");

    contactInp.setAttribute("data-required", "true");
    contactInp.setAttribute("data-max-length", "15");

    optionTel.textContent = "Телефон";
    optionEmail.textContent = "Email";
    optionVk.textContent = "Vk";
    optionFb.textContent = "Facebook";
    optionOther.textContent = "Другое";
    contactInp.placeholder = "Введите данные контакта";
    contactInp.type = "input";
    btnDelContact.innerHTML = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_224_6681)">
          <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0" />
      </g>
      <defs>
          <clipPath id="clip0_224_6681">
          <rect width="16" height="16" fill="white" />
          </clipPath>
      </defs>
  </svg>`;

    btnDelContact.type = "button";
    optionTel.value = "Телефон";
    optionEmail.value = "Email";
    optionVk.value = "Vk";
    optionFb.value = "Facebook";
    optionOther.value = "Другое";

    contactInp.addEventListener("input", () => {
      btnDelContact.style.display = "block";
      contactInpWrapper.style.width = "241px";
    });

    btnDelContact.addEventListener("click", () => {
      removeContact(item, contactsListElement, btnAddContact, contactsBlock);
    });

    select.append(optionTel, optionEmail, optionVk, optionFb, optionOther);
    contactInpWrapper.append(contactInp);
    item.append(select, contactInpWrapper, btnDelContact);

    return {
      item,
      select,
      contactInp,
    };
  }

  // МОДАЛЬНОЕ ОКНО УДАЛИТЬ КЛИЕНТА

  function createDeleteClientModal(clientObj) {
    const modal = document.createElement("dialog");
    const modalContent = document.createElement("div");
    const modalTitle = document.createElement("h2");
    const modalText = document.createElement("p");
    const btnDeleteModal = document.createElement("button");
    const btnCancelModal = document.createElement("button");
    const btnCloseModal = document.createElement("button");

    modal.classList.add("modal", "modal__delete");
    modalContent.classList.add(
      "modal__content",
      "modal__content-delete",
      "flex"
    );
    modalTitle.classList.add("modal__title", "modal-title-delete");
    modalText.classList.add("modal__text");
    btnDeleteModal.classList.add("btn-reset", "modal__delete-btn");
    btnCancelModal.classList.add("btn-reset", "modal__cancel");
    btnCloseModal.classList.add("btn-reset", "modal__close");

    modalTitle.textContent = `Удалить клиента`;
    modalText.textContent = `Вы действительно хотите удалить данного клиента?`;
    btnDeleteModal.textContent = `Удалить`;
    btnCancelModal.textContent = `Отменить`;
    btnCloseModal.innerHTML = `
  <svg width="17" height="17" viewBox="0 0 17 17" fill="CurrentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z" />
  </svg>`;

    modalContent.append(
      modalTitle,
      modalText,
      btnDeleteModal,
      btnCancelModal,
      btnCloseModal
    );
    modal.append(modalContent);

    const tableRow = document.querySelector(".clients__tr-delete");

    btnDeleteModal.addEventListener("click", function () {
      if (confirm("вы уверены?")) {
        fetch(`http://localhost:3000/api/clients/${clientObj.id}`, {
          method: "DELETE",
        });
        tableRow.remove();
      }
      closeModal(modal);
    });

    btnCancelModal.addEventListener("click", () => {
      closeModal(modal);
      tableRow.classList.remove("clients__tr-delete");
    });

    btnCloseModal.addEventListener("click", () => {
      closeModal(modal);
      tableRow.classList.remove("clients__tr-delete");
    });

    modal.addEventListener("click", (e) => {
      if (e.target == modal) closeModal(modal);
      tableRow.classList.remove("clients__tr-delete");
    });

    return modal;
  }

  // МОДАЛЬНОЕ ОКНО ИЗМЕНИТЬ КЛИЕНТА

  function createUpdateClientModal(clientObj) {
    const form = createForm();
    const modal = document.createElement("dialog");
    const modalContent = document.createElement("div");
    const idTitle = document.createElement("span");

    idTitle.classList.add("modal__id-title");
    modal.classList.add("modal");
    modalContent.classList.add("modal__content");

    form.title.textContent = `Изменить данные`;
    form.btnCancel.textContent = "Удалить клиента";
    const text = clientObj.id;
    idTitle.textContent = `ID:` + clientObj.id.substring(text.length - 6);

    form.title.append(idTitle);
    modalContent.append(form.title, form.form, form.btnCloseModal);
    modal.append(modalContent);
    modal.id = clientObj.id;
    location.hash = clientObj.id;

    const url = new URL(window.location.href);
    const urlClient = url.origin + url.pathname + "#" + clientObj.id;

    form.btnCancel.addEventListener("click", () => {
      openModal(createDeleteClientModal(clientObj.id));
    });

    form.btnCloseModal.addEventListener("click", () => {
      const tableRow = document.querySelector(".clients__tr-delete");
      if (tableRow) {
        tableRow.classList.remove("clients__tr-delete");
      }
    });

    form.inputSurname.value = clientObj.surname;
    form.inputName.value = clientObj.name;
    form.inputLastName.value = clientObj.lastName;

    form.inputSurname.value.trim()
      ? form.labelSurname.classList.add("modal__label-up")
      : form.labelSurname.classList.remove("modal__label-up");

    form.inputName.value.trim()
      ? form.labelName.classList.add("modal__label-name-up")
      : form.labelName.classList.remove("modal__label-name-up");

    form.inputLastName.value.trim()
      ? form.labelLastName.classList.add("modal__label-up")
      : form.labelLastName.classList.remove("modal__label-up");

    for (const contact of clientObj.contacts) {
      const createContact = createItemContact();

      createContact.select.value = contact.type;
      createContact.contactInp.value = contact.value;

      if (!createContact.select.classList.contains("choice")) {
        const choices = new Choices(createContact.select, {
          searchEnabled: false,
          itemSelectText: "",
          shouldSort: false,
          allowHTML: true,
        });
      }

      form.contactsListElement.prepend(createContact.item);
      form.contactsListElement.classList.add("contacts__list-toggle");
      form.contactsBlock.classList.add("modal__contacts-toggle");
    }

    form.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validation(form.form)) {
        const client = {
          surname: form.inputSurname.value.trim(),
          name: form.inputName.value.trim(),
          lastName: form.inputLastName.value.trim(),
          contacts: getContacts(),
        };

        await updateClientToServer(client, clientObj.id);

        const response = await fetch("http://localhost:3000/api/clients");
        const clientsList = await response.json();
        renderClientsTable(clientsList);
        form.form.reset();
        closeModal(modal);
        window.location.hash = "";
      }
    });

    form.btnCloseModal.addEventListener("click", () => {
      closeModal(modal);
      window.location.hash = "";
    });

    modal.addEventListener("click", (e) => {
      if (e.target == modal) {
        const tableRow = document.querySelector(".clients__tr-delete");
        if (tableRow) {
          tableRow.classList.remove("clients__tr-delete");
        }
        closeModal(modal);
        window.location.hash = "";
      }
    });

    return modal;
  }

  async function updateClientToServer(obj, id = null) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return await response.json();
  }

  // ВАЛИДАЦИЯ

  function validation(form) {
    let result = true;

    function removeError(input) {
      const parent = input.parentNode;
      if (parent.classList.contains("error")) {
        parent.querySelector(".errorlable").remove();
        parent.querySelector("input");
        input.style.borderBottom = "solid 1px #C8C5D1";
        parent.classList.remove("error");
      }
    }

    function createError(input, text) {
      const parent = input.parentNode;
      parent.classList.add("error");
      errorInputs = document.querySelectorAll(".error input");

      for (let input of errorInputs) {
        input.style.borderBottom = "solid 1px #f06a4d";
      }
      const errorLable = document.createElement("span");
      errorLable.classList.add("errorlable");
      errorLable.style.color = "#f06a4d";
      errorLable.textContent = text;
      parent.append(errorLable);
    }

    const allInputs = form.querySelectorAll("input");

    for (const input of allInputs) {
      removeError(input);

      if (input.dataset.maxLength) {
        removeError(input);
        if (input.value.length > input.dataset.maxLength) {
          createError(
            input,
            `Максимальное кол-во символов ${input.dataset.maxLength}!`
          );
          result = false;
        }
      }

      if (input.dataset.required === "true") {
        if (input.value === "") {
          createError(input, "Поле не заполнено!");
          result = false;
        }
      }

      input.addEventListener("input", () => {
        removeError(input);
      });
    }

    return result;
  }

  // СОРТИРОВКА

  async function sortClients(property, direction = "asc") {
    const response = await fetch("http://localhost:3000/api/clients");
    const array = await response.json();
    const sortedArray =
      direction == "asc"
        ? [...array].sort(function (a, b) {
            if (a[property] < b[property]) {
              return -1;
            }
            if (a[property] > b[property]) {
              return 1;
            }
            return 0;
          })
        : [...array].sort(function (a, b) {
            if (b[property] < a[property]) {
              return -1;
            }
            if (b[property] > a[property]) {
              return 1;
            }
            return 0;
          });

    renderClientsTable(sortedArray);
  }

  const table = document.querySelector("#table");
  const tableHeaders = table.querySelectorAll("th");

  [...tableHeaders].forEach((header) => {
    header.classList.add("cursor-pointer");
    header.addEventListener("click", function (e) {
      if (header.dataset.id) {
        if (header.getAttribute("data-dir") == "desc") {
          sortClients("id", "desc");
          header.setAttribute("data-dir", "asc");
          e.target.classList.toggle("clicked");
        } else {
          sortClients("id", "asc");
          header.setAttribute("data-dir", "desc");
          e.target.classList.remove("clicked");
        }
      }

      if (header.dataset.fullname) {
        if (header.getAttribute("data-dir") == "desc") {
          sortClients("surname", "desc");
          header.setAttribute("data-dir", "asc");
          e.target.classList.remove("clicked");
        } else {
          sortClients("surname", "asc");
          header.setAttribute("data-dir", "desc");
          e.target.classList.toggle("clicked");
        }
      }

      if (header.dataset.created) {
        if (header.getAttribute("data-dir") == "desc") {
          sortClients("createdAt", "desc");
          header.setAttribute("data-dir", "asc");
          e.target.classList.remove("clicked");
        } else {
          sortClients("createdAt", "asc");
          header.setAttribute("data-dir", "desc");
          e.target.classList.toggle("clicked");
        }
      }
      if (header.dataset.updated) {
        if (header.getAttribute("data-dir") == "desc") {
          sortClients("updatedAt", "desc");
          header.setAttribute("data-dir", "asc");
          e.target.classList.remove("clicked");
        } else {
          sortClients("updatedAt", "asc");
          header.setAttribute("data-dir", "desc");
          e.target.classList.toggle("clicked");
        }
      }
    });
  });

  // ПОИСК

  async function findClient(search) {
    const response = await fetch(
      `http://localhost:3000/api/clients?search=${search}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const foundClients = await response.json();
    return foundClients;
  }

  async function getClients() {
    const response = await fetch("http://localhost:3000/api/clients");
    const clients = await response.json();
    return clients;
  }

  async function rewriteTable(str) {
    const clientsArray = await findClient(str);
    const tableBody = document.querySelector("#table tbody");
    tableBody.innerHTML = " ";

    for (const client of clientsArray) {
      const newTableRow = createClientElement(client);
      tableBody.append(newTableRow);
    }
  }

  async function searchClientsList() {
    const searchList = document.querySelector(".header__search-list");
    const clients = await getClients();

    clients.forEach((client) => {
      const searchItem = document.createElement("li");
      const searchLink = document.createElement("a");

      searchItem.classList.add("header__search-item");
      searchLink.classList.add("header__search-link");

      searchLink.textContent = `${client.name} ${client.surname} ${client.lastName}`;
      searchLink.href = "#";

      searchItem.append(searchLink);
      searchList.append(searchItem);
    });
  }

  searchClientsList();

  const searchInput = document.querySelector(".header__search-input");

  searchInput.addEventListener("input", async function (e) {
    e.preventDefault();

    const value = searchInput.value.trim().toUpperCase();
    const foundItems = document.querySelectorAll(".header__search-link");
    const searchList = document.querySelector(".header__search-list");

    setTimeout(function () {
      if (value !== "") {
        rewriteTable(value);

        foundItems.forEach((link) => {
          if (link.innerText.trim().toUpperCase().search(value) === -1) {
            link.classList.add("hide");
            link.innerHTML = link.innerText;
          } else {
            link.classList.remove("hide");
            searchList.classList.remove("hide");
            link.innerHTML = link.innerText;
            const str = link.innerText;
            link.innerHTML = insertMark(
              str,
              link.innerText.trim().toUpperCase().search(value),
              value.length
            );
          }
        });
      } else {
        foundItems.forEach((link) => {
          const tableBody = document.querySelector(".clients__tbody");
          tableBody.innerHTML = " ";
          rewriteTable(value);

          link.classList.add("hide");
          searchList.classList.add("hide");
          link.innerHTML = link.innerText;
        });
      }
    }, 300);
  });

  const insertMark = (str, pos, length) =>
    str.slice(0, pos) +
    `<mark>` +
    str.slice(pos, pos + length) +
    `</mark>` +
    str.slice(pos + length);
});
