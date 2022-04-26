var rs = getComputedStyle(document.querySelector(":root"));
var actual_page = 1;
var datos_buscados = "nullnullnull";
var actual_view = "inbox";

document.addEventListener("DOMContentLoaded", function () {
  // var r = document.querySelector(":root");
  //var rs = getComputedStyle(document.querySelector(":root"));

  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () =>
      load_mailbox("inbox", 1, 0, datos_buscados)
    );
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent", 1, 0, datos_buscados));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive", 1, 0, datos_buscados));
  document
    .querySelector("#compose")
    .addEventListener("click", () => compose_email(null));

  document.addEventListener("click", (event) => {
    //event.stopPropagation();
    const element = event.target;
    // document.querySelector(".menu").style.backgroundImage =
    //   "url({% static '/assets/Backgroup1.png' %}";
    // document.querySelector(
    //   ".menu"
    // ).style.backgroundImage = "url({% static '/assets/Backgroup1.png' %}";

    // document.querySelector("#menu").style.display = "none";
    // console.log("reloco");
    // console.log(event);
    //  console.log(element.classList[0]);
    // console.log(element.dataset);
    // console.log(element.dataset.class);
    // console.log(element.getAttribute("class"));
    // console.log(element.getAttribute("value"));
    if (element.getAttribute("class") == "archive_svg") {
      //  alert("kacepapa archive");
      fetch(`/emails/${element.getAttribute("value")}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: true,
        }),
      });

      // load_mailbox("inbox", actual_page, 0);
      // ;
      setTimeout(
        () => load_mailbox("inbox", actual_page, 0, datos_buscados),
        100
      );
      setTimeout(() => event.stopPropagation(), 100);
    }

    if (element.getAttribute("class") == "unarchive_svg") {
      //  alert("kacepapa UNarchive");
      fetch(`/emails/${element.getAttribute("value")}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: false,
        }),
      });

      // load_mailbox("inbox", actual_page, 0);
      // ;
      setTimeout(
        () => load_mailbox("archive", actual_page, 0, datos_buscados),
        100
      );
      setTimeout(() => event.stopPropagation(), 100);
    }
    // alert("probando probando");
    //document.currentScript.getAttribute('one');

    if (element.id === "archive_email") {
      //alert("vamopototo");
      //console.log(element.dataset.id);
      //Archivar mail
      fetch(`/emails/${element.dataset.id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: true,
        }),
      });
      //load_mailbox('inbox');
      // setTimeout(() => load_mailbox("inbox"), 100);
      setTimeout(() => load_mailbox(`/emails/${element.dataset.id}`), 100);
    } else if (element.id === "unarchive_email") {
      fetch(`/emails/${element.dataset.id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: false,
        }),
      });
      //load_mailbox('inbox');
      // setTimeout(() => load_mailbox("inbox"), 100);
      setTimeout(() => load_mailbox(`/emails/${element.dataset.id}`), 100);
    } else if (element.id === "reply") {
      /*console.log(element.dataset.sender);
      console.log(element.dataset.subject);
      console.log(element.dataset.timestamp);
      console.log(element.dataset.body);*/
      const data_reply = {
        sender: element.dataset.sender,
        subject: element.dataset.subject,
        timestamp: element.dataset.timestamp,
        body: element.dataset.body,
      };
      compose_email(data_reply);
    }

    // alert("chucaro1")
    // console.log(actual_view)
    if(element.classList[0] == "arrow-first-page" && document.getElementById("arrow-first-page").disabled == false) {
      // alert("chucaro1")
      load_mailbox(actual_view, actual_page, 12, datos_buscados);
    }
    if(element.classList[0] == "arrow-prev-page" && document.getElementById("arrow-prev-page").disabled == false) {
      // alert("chucaro2")
      load_mailbox(actual_view, actual_page, 11, datos_buscados);
    }
    if(element.classList[0] == "arrow-next-page" && document.getElementById("arrow-next-page").disabled == false) {
      // alert("chucaro3")
      load_mailbox(actual_view, actual_page, 1, datos_buscados);
    }
    if(element.classList[0] == "arrow-last-page" && document.getElementById("arrow-last-page").disabled == false) {
      // alert("chucaro4")
      load_mailbox(actual_view, actual_page, 2, datos_buscados);
    }
  });

  document.querySelector(".logo-user").addEventListener("click", () => {
    document.querySelector(".modal-logout").style.opacity = 1;
    document.querySelector(".modal-logout").style.pointerEvents = "auto";
  });
  document.querySelector("#cancel-logout").addEventListener("click", () => {
    document.querySelector(".modal-logout").style.opacity = 0;
    document.querySelector(".modal-logout").style.pointerEvents = "none";
  });

  // document.getElementById("arrow-first-page").addEventListener("click", () => {
  //   load_mailbox("inbox", actual_page, 12, datos_buscados);
  // });
  // document.getElementById("arrow-prev-page").addEventListener("click", () => {
  //   load_mailbox("inbox", actual_page, 11, datos_buscados);
  // });
  // document.getElementById("arrow-next-page").addEventListener("click", () => {
  //   load_mailbox("inbox", actual_page, 1, datos_buscados);
  // });
  // document.getElementById("arrow-last-page").addEventListener("click", () => {
  //   load_mailbox("inbox", actual_page, 2, datos_buscados);
  // });

  // first_page();
  // By default, load the inbox
  load_mailbox("inbox", actual_page, 0, datos_buscados);
});

function compose_email(reply_data) {
  // Show compose view and hide other views
  document.querySelector("#inbox-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  document.querySelector("#sent-view").style.display = "none";
  document.querySelector("#archived-view").style.display = "none";
  document.querySelector("#emails-view").style.display = "none";

  // document.querySelector("#menu1").style.display = "none";
  // document.querySelector("#menu2").style.display = "none";
  // document.querySelector("#menu3").style.display = "none";
  // document.querySelector("#menu4").style.display = "block";

  document.querySelector("#inbox").style.backgroundColor =
    rs.getPropertyValue("--first-beta-color");
  document.querySelector("#archived").style.backgroundColor =
    rs.getPropertyValue("--first-beta-color");
  document.querySelector("#sent").style.backgroundColor =
    rs.getPropertyValue("--first-beta-color");
  document.querySelector("#compose").style.backgroundColor =
    rs.getPropertyValue("--gray-light-color");

  if (screen.width < 1024) {
    document.querySelector("#sep_menu1").style.borderRadius = 0;
    document.querySelector("#sep_menu2").style.borderRadius = 0;
    document.querySelector("#sep_menu3").style.borderRadius = 0;
    document.querySelector("#sep_menu4").style.borderTopLeftRadius = 0;
    document.querySelector("#sep_menu4").style.borderTopRightRadius = "5px";
    document.querySelector("#sep_menu5").style.borderTopLeftRadius = "5px";
  } else {
    document.querySelector("#sep_menu1").style.borderRadius = 0;
    document.querySelector("#sep_menu2").style.borderRadius = 0;
    document.querySelector("#sep_menu3").style.borderRadius = 0;
    document.querySelector("#sep_menu4").style.borderTopRightRadius = 0;
    document.querySelector("#sep_menu4").style.borderBottomRightRadius = "5px";
    document.querySelector("#sep_menu5").style.borderTopRightRadius = "5px";
    document.querySelector("#sep_menu5").style.borderBottomRightRadius = 0;
  }
  document.querySelector("#inbox svg path").style.fill =
    rs.getPropertyValue("--gray-light-color");
  document.querySelector("#archived svg path").style.fill =
    rs.getPropertyValue("--gray-light-color");
  document.querySelector("#sent svg path").style.fill =
    rs.getPropertyValue("--gray-light-color");
  document.querySelector("#compose svg path").style.fill = rs.getPropertyValue(
    "--first-alpha-color"
  );

  document.querySelector("#inbox1").style.display = "block";
  document.querySelector("#inbox2").style.display = "none";
  document.querySelector("#archived1").style.display = "block";
  document.querySelector("#archived2").style.display = "none";
  document.querySelector("#sent1").style.display = "block";
  document.querySelector("#sent2").style.display = "none";
  document.querySelector("#compose1").style.display = "none";
  document.querySelector("#compose2").style.display = "block";

  // document.querySelector("#menu11").style.display = "none";
  // document.querySelector("#menu22").style.display = "none";
  // document.querySelector("#menu33").style.display = "none";
  // document.querySelector("#menu44").style.display = "block";

  // Clear out composition fields
  if (reply_data) {
    /*alert("llega aca");
    console.log(reply_data);
    console.log(reply_data.sender);
    console.log(reply_data.subject);
    console.log(reply_data.timestamp);
    console.log(reply_data.body);*/
    //alert(reply_data.subject.substr(0,4));
    if (reply_data.subject.substr(0, 4) != "Re: ")
      reply_data.subject = `Re: ${reply_data.subject}`;

    reply_data.body = `
    
    
On ${reply_data.timestamp} 
${reply_data.sender} wrote:
${reply_data.body}`;

    document.querySelector("#compose-recipients").value = reply_data.sender;
    document.querySelector("#compose-subject").value = reply_data.subject;
    document.querySelector("#compose-body").value = reply_data.body;
  } else {
    document.querySelector("#compose-recipients").value = "";
    document.querySelector("#compose-subject").value = "";
    document.querySelector("#compose-body").value = "";
  }
  // document.querySelector('#send_email').addEventListener('click', () => {
  //   alert(document.querySelector('#compose-recipients').value);
  // });

  document.querySelector("#compose-form").onsubmit = () => {
    // alert(document.querySelector("#compose-recipients").value);
    // alert(document.querySelector("#compose-subject").value);
    // alert(document.querySelector("#compose-body").value);

    var rec = document.querySelector("#compose-recipients").value;
    var sub = document.querySelector("#compose-subject").value;
    var bod = document.querySelector("#compose-body").value;

    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: rec,
        subject: sub,
        body: bod,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Print result
        //console.log(result);
        // alert("Alerta roja");
        load_mailbox("sent", 1, 0, datos_buscados);
      });

    return false;
  };
}
/*
function get_senmails(content){
  console.log(content);
  //console.log(content.sender);
  const user_log = document.querySelector('#testuser').value;
  alert(user_log);
  if(content.sender === user_log){
    alert("OK");
  }
}*/

function load_mailbox(mailbox, a_page, j_page,  d_search) {
  actual_view = mailbox;
  // console.log(`mailbox: ${mailbox}`);
  // console.log(`a_page: ${a_page}`);
  // console.log(`j_page: ${j_page}`);
  // console.log(`d_search: ${d_search}`);
  // console.log(`------------------------------`);
  // n_page=1;
  // grab element you want to hide
  //const elem = document.querySelector('#hint');
  // remove element
  // elem.parentNode.removeChild(elem);
  //mailbox="reloko";
  //mailbox=1;
  //alert(`Mailbox: ${mailbox}`);
  const submailbox = mailbox.substring(1, 7);
  // alert(`mailbox: ${mailbox}`);
  //alert(`llega hasta aca: ${submailbox}`);
  if (mailbox === "inbox") {
    document.querySelector("#inbox-view").style.display = "block";
    document.querySelector("#sent-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#archived-view").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";

    // var rs = getComputedStyle(document.querySelector(":root"));

    // document.querySelector("#menu1").style.display = "block";
    // document.querySelector("#menu2").style.display = "none";
    // document.querySelector("#menu3").style.display = "none";
    // document.querySelector("#menu4").style.display = "none";

    document.querySelector("#inbox").style.backgroundColor =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#archived").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");
    document.querySelector("#sent").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");
    document.querySelector("#compose").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");

    //  alert(screen.width);
    //  alert("holita");
    if (screen.width < 1024) {
      // alert("es pantalla chica");
      document.querySelector("#sep_menu1").style.borderTopRightRadius = "5px";
      document.querySelector("#sep_menu2").style.borderTopLeftRadius = "5px";
      document.querySelector("#sep_menu2").style.borderTopRightRadius = 0;
      document.querySelector("#sep_menu3").style.borderRadius = 0;
      document.querySelector("#sep_menu4").style.borderRadius = 0;
      document.querySelector("#sep_menu5").style.borderRadius = 0;
    } else {
      document.querySelector("#sep_menu1").style.borderBottomRightRadius =
        "5px";
      document.querySelector("#sep_menu2").style.borderTopRightRadius = "5px";
      document.querySelector("#sep_menu2").style.borderBottomRightRadius = 0;
      document.querySelector("#sep_menu3").style.borderRadius = 0;
      document.querySelector("#sep_menu4").style.borderRadius = 0;
      document.querySelector("#sep_menu5").style.borderRadius = 0;
    }

    document.querySelector("#inbox svg path").style.fill = rs.getPropertyValue(
      "--first-alpha-color"
    );
    document.querySelector("#archived svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#sent svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#compose svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");

    document.querySelector("#inbox1").style.display = "none";
    document.querySelector("#inbox2").style.display = "block";
    document.querySelector("#archived1").style.display = "block";
    document.querySelector("#archived2").style.display = "none";
    document.querySelector("#sent1").style.display = "block";
    document.querySelector("#sent2").style.display = "none";
    document.querySelector("#compose1").style.display = "block";
    document.querySelector("#compose2").style.display = "none";

    document.querySelector(".pagination").style.display = "block";
    // document.querySelector("#lookup-form").style.display = "block";
    // document.querySelector("#menu11").style.display = "block";
    // document.querySelector("#menu22").style.display = "none";
    // document.querySelector("#menu33").style.display = "none";
    // document.querySelector("#menu44").style.display = "none";

    fetch(`/emails/inbox/${a_page}/${j_page}/${d_search}`)
      .then((response) => response.json())
      .then((emails) => {
        // Print emails
        //  console.log(emails.forEach(content));

        // console.log(emails.emails_json);
        // console.log(emails.users_json);
        // console.log(emails.p_actual);
        // console.log(emails.p_last);
        if (emails.p_actual == 1 && emails.p_actual == emails.p_last) {
          single_page();
        } else if (emails.p_actual == 1) {
          first_page();
        } else if (emails.p_actual == emails.p_last) {
          last_page();
        } else {
          middle_page();
        }
        actual_page = emails.p_actual;

        // var stringified = JSON.stringify(emails.emails_json);
        //  console.log(emails.emails_json);
        //  var emails_parsed = JSON.stringify(emails.emails_json)
        //   .replace("\r", '"#"')
        //   .replace("\n", '"*"');
        // var emails_parsed = JSON.parse(stringified);
        var emails_parsed = JSON.parse(emails.emails_json);
        var users_parsed = JSON.parse(emails.users_json);

        //  var emails_parsed = JSON.parse('{"a", "b", "c", 1}');
        // console.log(emails_parsed);
        // console.log(users_parsed);
        // users_parsed.forEach((content) =>{
        //   console.log(content);
        //   console.log(content.pk);
        // });
        // console.log("----------**********----------");

        // console.log("----------**********----------");
        // emails_parsed = JSON.parse(emails.emails_json);

        // console.log(emails_parsed);
        // for (var data_email of emails_parsed) {
        //   console.log(data_email);
        // }

        emails_parsed.forEach((content) => {
          var sender_email = users_parsed.filter(function (entry) {
            return entry.pk == content.fields.sender;
          });

          // console.log(sender_email[0]);
          // console.log(content.pk);
          // console.log(content.fields.sender);
          // console.log(content.fields.recipients[0]);
          // console.log("datetimee: ");
          // console.log(content.fields.timestamp);

          var cont = content.fields.recipients;
          var user_log = document.getElementById("testiduser").value;
          // console.log(document.querySelector("#testiduser").value);
          // console.log(cont);
          // console.log(user_log);
          // console.log(cont.includes(parseInt(user_log)));
          // alert(user_log);
          // // // // // // content.recipients.forEach((cont) => {------------------------------------
          // console.log(
          //   "el sender_email.fields.email es esto: " + sender_email[0].fields.email
          // );
          // console.log("el cont es esto: " + cont);
          // console.log("mientras que el userlog es esto: " + user_log);
          // if (cont.includes(parseInt(user_log))) {
            const post = document.createElement("div");
            post.id = "email";
            post.className = "email";
            // content.fields.sender = content.fields.sender.toString();
            sender_email[0].fields.email =
            sender_email[0].fields.email.toString();
            // if (content.fields.sender.length > 14)
            // alert(screen.width)

            if (screen.width < 768) {
              if (sender_email[0].fields.email.length > 17)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                sender_email[0].fields.email =
                  sender_email[0].fields.email.substring(0, 17) + "...";
              if (content.fields.subject.length > 20)
                content.fields.subject =
                  content.fields.subject.substring(0, 20) + "...";
            } else if (screen.width < 1024) {
              if (sender_email[0].fields.email.length > 20)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                sender_email[0].fields.email =
                  sender_email[0].fields.email.substring(0, 20) + "...";
              if (content.fields.subject.length > 23)
                content.fields.subject =
                  content.fields.subject.substring(0, 23) + "...";
            } else {
              if (sender_email[0].fields.email.length > 30)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                sender_email[0].fields.email =
                  sender_email[0].fields.email.substring(0, 30) + "...";
              if (content.fields.subject.length > 35)
                content.fields.subject =
                  content.fields.subject.substring(0, 35) + "...";
            }

            let svg_inbox;
            // console.log(content);
            if (content.fields.read) {
              // post.style.backgroundColor = "#E6E6E6";
              svg_inbox = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.9438 10.21L15.6938 2.71001C15.4885 2.57323 15.2473 2.50024 15.0006 2.50024C14.7539 2.50024 14.5128 2.57323 14.3075 2.71001L3.0575 10.21C2.88612 10.3241 2.74556 10.4787 2.64831 10.6601C2.55105 10.8415 2.50011 11.0442 2.5 11.25V25C2.5 26.3788 3.62125 27.5 5 27.5H25C26.3788 27.5 27.5 26.3788 27.5 25V11.25C27.5 10.8325 27.2913 10.4425 26.9438 10.21ZM15 5.25251L23.9963 11.25L15 17.2475L6.00375 11.25L15 5.25251ZM5 25V13.5863L14.3062 19.79C14.5117 19.9271 14.7531 20.0002 15 20.0002C15.2469 20.0002 15.4883 19.9271 15.6938 19.79L25 13.5863L24.9962 25H5Z" fill="#001A83"/></svg>`;
            } else {
              svg_inbox = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25 5H5C3.62125 5 2.5 6.12125 2.5 7.5V22.5C2.5 23.8788 3.62125 25 5 25H25C26.3788 25 27.5 23.8788 27.5 22.5V7.5C27.5 6.12125 26.3788 5 25 5ZM25 7.5V8.13875L15 15.9175L5 8.14V7.5H25ZM5 22.5V11.305L14.2325 18.4862C14.4514 18.6582 14.7217 18.7516 15 18.7516C15.2783 18.7516 15.5486 18.6582 15.7675 18.4862L25 11.305L25.0025 22.5H5Z" fill="#001A83"/> </svg>`;
            }

            // console.log(typeof content.timestamp);
            // console.log(dateFormat(content.timestamp));
            const timestampFormatted = dateFormat(content.fields.timestamp, "list");
            
            // console.log(content.fields.timestamp);
            // console.log(timestampFormatted);
            // onclick = "load_mailbox('/emails/${content.pk}')"
            // onclick = "load_max(event)";
            post.innerHTML = `
                                <div id="left-content" onclick = "load_mailbox('/emails/${content.pk}')" >
                                  ${svg_inbox}
                                  <div id="sender-and-subject">
                                    <div id="first_column"><b>${sender_email[0].fields.email}</b></div> 
                                    <div id="second_column"><b>${content.fields.subject}</b></div>
                                  </div>
                                </div>
                                <div id="time-and-archive">
                                  <div id="third_column">${timestampFormatted}</div>
                                  <svg  class="archive_svg" value="${content.pk}"  width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path class="archive_svg" value="${content.pk}" d="M14.9999 1.66675H4.99992C4.08075 1.66675 3.33325 2.41425 3.33325 3.33341V18.3334L9.99992 14.5234L16.6666 18.3334V3.33341C16.6666 2.41425 15.9191 1.66675 14.9999 1.66675ZM14.9999 15.4609L9.99992 12.6042L4.99992 15.4609V3.33341H14.9999V15.4609Z" fill="#001A83"/></svg>
                                </div>`;

            // post.addEventListener("click", (event) => {
            //   load_mailbox(`/emails/${content.pk}`);
            // });

            document.querySelector("#inbox-view").append(post);
            // space_emails = document.createElement("br");
            // document.querySelector("#inbox-view").appendChild(space_emails);

            // const elmnt = inboxTemplate.content.cloneNode(true).children[0];
            // return {
            //   sender: content.sender,
            //   subject: content.subject,
            //   element: elmnt,
            // };
          // }
        });
      });
    // ... do something else with emails ...
    // });------------------------
    // document.querySelector("#inbox-view").innerHTML = `<h3>${
    //   mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    // }</h3>`;
    document.querySelector("#inbox-view").innerHTML = ` `;

    // document.querySelector(
    //   "#inbox-view"
    // ).innerHTML += `<button id="page" onclick="load_mailbox('inbox', 1);">pagina1</button>`;
    // document.querySelector(
    //   "#inbox-view"
    // ).innerHTML += `<button id="page" onclick="load_mailbox('inbox', 2);">pagina2</button>`;
  } else if (mailbox === "sent") {
    document.querySelector("#sent-view").style.display = "block";
    document.querySelector("#inbox-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#archived-view").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";

    document.querySelector(".pagination").style.display = "block";
    // document.querySelector("#menu1").style.display = "none";
    // document.querySelector("#menu2").style.display = "none";
    // document.querySelector("#menu3").style.display = "block";
    // document.querySelector("#menu4").style.display = "none";

    document.querySelector("#inbox").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");
    document.querySelector("#archived").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");
    document.querySelector("#sent").style.backgroundColor =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#compose").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");

    if (screen.width < 1024) {
      document.querySelector("#sep_menu1").style.borderRadius = 0;
      document.querySelector("#sep_menu2").style.borderRadius = 0;
      document.querySelector("#sep_menu3").style.borderTopLeftRadius = 0;
      document.querySelector("#sep_menu3").style.borderTopRightRadius = "5px";
      document.querySelector("#sep_menu4").style.borderTopLeftRadius = "5px";
      document.querySelector("#sep_menu4").style.borderTopRightRadius = 0;
      document.querySelector("#sep_menu5").style.borderRadius = 0;
    } else {
      document.querySelector("#sep_menu1").style.borderRadius = 0;
      document.querySelector("#sep_menu2").style.borderRadius = 0;
      document.querySelector("#sep_menu3").style.borderTopRightRadius = 0;
      document.querySelector("#sep_menu3").style.borderBottomRightRadius =
        "5px";
      document.querySelector("#sep_menu4").style.borderTopRightRadius = "5px";
      document.querySelector("#sep_menu4").style.borderBottomRightRadius = 0;
      document.querySelector("#sep_menu5").style.borderRadius = 0;
    }

    document.querySelector("#inbox svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#archived svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#sent svg path").style.fill = rs.getPropertyValue(
      "--first-alpha-color"
    );
    document.querySelector("#compose svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");

    document.querySelector("#inbox1").style.display = "block";
    document.querySelector("#inbox2").style.display = "none";
    document.querySelector("#archived1").style.display = "block";
    document.querySelector("#archived2").style.display = "none";
    document.querySelector("#sent1").style.display = "none";
    document.querySelector("#sent2").style.display = "block";
    document.querySelector("#compose1").style.display = "block";
    document.querySelector("#compose2").style.display = "none";

    // document.querySelector("#menu11").style.display = "none";
    // document.querySelector("#menu22").style.display = "none";
    // document.querySelector("#menu33").style.display = "block";
    // document.querySelector("#menu44").style.display = "none";

    // fetch(`/emails/archive/${a_page}/${j_page}/${d_search}`)

    fetch(`/emails/sent/${a_page}/${j_page}/${d_search}`)
      .then((response) => response.json())
      .then((emails) => {
        // Print emails
        //console.log(`Emails: ${emails}`);
        //console.log(emails.forEach());
        // console.log(emails);
        // console.log(emails.emails_json);
        // console.log(emails.users_json);
        // console.log(emails.p_actual);
        // console.log(emails.p_last);
        if (emails.p_actual == 1 && emails.p_actual == emails.p_last) {
          single_page();
        } else if (emails.p_actual == 1) {
          first_page();
        } else if (emails.p_actual == emails.p_last) {
          last_page();
        } else {
          middle_page();
        }
        actual_page = emails.p_actual;

        var emails_parsed = JSON.parse(emails.emails_json);
        var users_parsed = JSON.parse(emails.users_json);

        // emails.forEach((content) => {
        emails_parsed.forEach((content) => {
          var recipients_email = [] ;
          var str_recipients;
          // recipients_email[0] = users_parsed.filter(function (entry) {
          //   return entry.pk == content.fields.recipients[0];
          // });
          // recipients_email[1] = users_parsed.filter(function (entry) {
          //   return entry.pk == content.fields.recipients[1];
          // });

          content.fields.recipients.forEach((id_recipient) => {
            // console.log(id_recipient);
            recipients_email[id_recipient] = users_parsed.filter(function (entry) {
            // recipients_email= users_parsed.filter(function (entry) {
              return entry.pk == id_recipient;
            });
            
            // recipients_email[0].fields.email = recipients_email[0].fields.email + ", " + recipients_email[0].fields.email 

            // console.log(recipients_email);
          });

          let first_entrance=true;
          let str_recipient;
          recipients_email.forEach((recipient) => {
            if(first_entrance){
              str_recipient = recipient[0].fields.email.toString();
              first_entrance = false;
            }
            else{
              str_recipient = str_recipient + ", " + recipient[0].fields.email.toString();
            }
            // console.log(recipient);

          })
          // console.log(content);
          // / console.log(str_recipient);
          //  console.log(recipients_email.filter(Boolean).length);


          //console.log(content.sender);
          // console.log(content.fields.recipients.length);
          // var cont = content.fields.sender[0];
          var cont = content.fields.sender;
          var user_log = document.getElementById("testiduser").value;
          // const user_log = document.querySelector("#testuser").value;
          // console.log(`cont: ${cont} /-/-/-/ user_log: ${user_log}`);
          // if (content.sender === user_log) {
          if (cont == user_log) {
            // console.log("llega o no llega¡__?");
            /*       document.querySelector('#sent-view').style.display = 'block';
            document.querySelector('#inbox-view').style.display = 'none';
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#archived-view').style.display = 'none';
      */ //document.querySelector("#sent-to").innerHTML = content.recipients;
            //document.querySelector("#sent-subject").innerHTML = content.subject;
            // document.querySelector("#sent-body").innerHTML = content.body;

            const post = document.createElement("div");
            post.id = "email";
            post.className = "email";
            // post.className = 'post';
            //post.innerHTML = "Recipients: "+content.recipients+"<br/>Subject: "+content.subject+"<br/>Body: "+content.body+"<br/><br/>";
            /*post.innerHTML = `<p><b>Recipients:</b> ${content.recipients}<br/>
                              <b>Subject:</b> ${content.subject}<br/>
                              <b>Date:</b> ${content.timestamp}</p>`;
          */
            // recipients_email[0][0].fields.email =
            // recipients_email[0][0].fields.email.toString();
            // recipients_email[1][0].fields.email =
            // recipients_email[1][0].fields.email.toString();
            // recipients_email.forEach((id_recipient) => {
              //  console.log(id_recipient);
              // recipients_email[id_recipient] = users_parsed.filter(function (entry) {
                // return entry.pk == id_recipient;
              // });
            // });

            // recipients_email[0][0].fields.email = recipients_email[0][0].fields.email + ", " + recipients_email[1][0].fields.email 


            if (screen.width < 768) {
              // if (recipients_email[0][0].fields.email.length > 17)
              if (str_recipient.length > 17)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                str_recipient =
                str_recipient.substring(0, 17) + "...";
              if (content.fields.subject.length > 20)
                content.fields.subject =
                  content.fields.subject.substring(0, 20) + "...";
            } else if (screen.width < 1024) {
              // if (recipients_email[0][0].fields.email.length > 20)
              if (str_recipient.length > 20)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                str_recipient =
                str_recipient.substring(0, 20) + "...";
              if (content.fields.subject.length > 23)
                content.fields.subject =
                  content.fields.subject.substring(0, 23) + "...";
            } else {
              // if (recipients_email[0][0].fields.email.length > 30)
              if (str_recipient.length > 30)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                str_recipient =
                str_recipient.substring(0, 30) + "...";
              if (content.fields.subject.length > 35)
                content.fields.subject =
                  content.fields.subject.substring(0, 35) + "...";
            }

            let svg_inbox = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.9438 10.21L15.6938 2.71001C15.4885 2.57323 15.2473 2.50024 15.0006 2.50024C14.7539 2.50024 14.5128 2.57323 14.3075 2.71001L3.0575 10.21C2.88612 10.3241 2.74556 10.4787 2.64831 10.6601C2.55105 10.8415 2.50011 11.0442 2.5 11.25V25C2.5 26.3788 3.62125 27.5 5 27.5H25C26.3788 27.5 27.5 26.3788 27.5 25V11.25C27.5 10.8325 27.2913 10.4425 26.9438 10.21ZM15 5.25251L23.9963 11.25L15 17.2475L6.00375 11.25L15 5.25251ZM5 25V13.5863L14.3062 19.79C14.5117 19.9271 14.7531 20.0002 15 20.0002C15.2469 20.0002 15.4883 19.9271 15.6938 19.79L25 13.5863L24.9962 25H5Z" fill="#001A83"/></svg>`;
            
            const timestampFormatted = dateFormat(content.fields.timestamp, "list");
            
            // content.recipients = content.recipients.toString();
            // if (content.recipients.length > 27)
            //   content.recipients = content.recipients.substring(0, 27) + "...";

            /*console.log(content);
            console.log(content.sender);
            console.log(content.subject);
            console.log(content.body);*/

            // if (content.subject.length > 45)
            //   content.subject = content.subject.substring(0, 45) + "...";

            // post.innerHTML = `<div id="first_column"> <b>${content.recipients}</b></div>
            //                   <div id="second_column"><b>${content.subject}</b></div>
            //                   <div id="third_column">${content.timestamp}</div>`;
            post.innerHTML = `
                              <div id="left-content" onclick = "load_mailbox('/emails/${content.pk}')" >
                                ${svg_inbox}
                                <div id="sender-and-subject">
                                  <div id="first_column"><b>${str_recipient}</b></div> 
                                  <div id="second_column"><b>${content.fields.subject}</b></div>
                                </div>
                              </div>
                              <div id="time-and-archive">
                                <div id="third_column">${timestampFormatted}</div>
                                <svg  class="archive_svg" value="${content.pk}"  width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="archive_svg" value="${content.pk}" d="M14.9999 1.66675H4.99992C4.08075 1.66675 3.33325 2.41425 3.33325 3.33341V18.3334L9.99992 14.5234L16.6666 18.3334V3.33341C16.6666 2.41425 15.9191 1.66675 14.9999 1.66675ZM14.9999 15.4609L9.99992 12.6042L4.99992 15.4609V3.33341H14.9999V15.4609Z" fill="#001A83"/></svg>
                              </div>`;

            //  post.innerHTML = `<p><b>Recipients:</b> ${content.recipients}<br/><b>Subject:</b> ${content.subject}<br/><b>Body:</b> ${content.body}<br/><b>Date:</b> ${content.timestamp}</p>`;
            //    if(content.read){
            //        post.style.backgroundColor = "LightGray";
            //        post.style.boxShadow = "3px 3px";
            //      }

            // post.addEventListener("click", (event) => {
            //   //const element = event.target;
            //   //console.log(element);
            //   // if(element.className !== 'archive_email'){
            //   load_mailbox(`/emails/${content.id}`);
            //   // }
            // });
            document.querySelector("#sent-view").append(post);
            // space_emails = document.createElement("br");
            // document.querySelector("#sent-view").appendChild(space_emails);
          }
        });
        // ... do something else with emails ...
      });
    // document.querySelector("#sent-view").innerHTML = `<h3>${
    //   mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    // }</h3>`;
    
    document.querySelector("#sent-view").innerHTML = ` `;

  } else if (mailbox === "archive") {
    // alert("segundo alert de archive");
    document.querySelector("#archived-view").style.display = "block";
    document.querySelector("#sent-view").style.display = "none";
    document.querySelector("#inbox-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";

    document.querySelector(".pagination").style.display = "block";
    // document.querySelector("#lookup-form").style.display = "block";
    // document.querySelector("#menu1").style.display = "none";
    // document.querySelector("#menu2").style.display = "block";
    // document.querySelector("#menu3").style.display = "none";
    // document.querySelector("#menu4").style.display = "none";

    document.querySelector("#inbox").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");
    document.querySelector("#archived").style.backgroundColor =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#sent").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");
    document.querySelector("#compose").style.backgroundColor =
      rs.getPropertyValue("--first-beta-color");

    if(screen.width < 1024){
      document.querySelector("#sep_menu1").style.borderRadius = 0;
      document.querySelector("#sep_menu2").style.borderTopLeftRadius = 0;
      document.querySelector("#sep_menu2").style.borderTopRightRadius = "5px";
      document.querySelector("#sep_menu3").style.borderTopLeftRadius = "5px";
      document.querySelector("#sep_menu3").style.borderTopRightRadius = 0;
      document.querySelector("#sep_menu4").style.borderRadius = 0;
      document.querySelector("#sep_menu5").style.borderRadius = 0;
    } else {
      document.querySelector("#sep_menu1").style.borderRadius = 0;
      document.querySelector("#sep_menu2").style.borderTopRightRadius = 0;
      document.querySelector("#sep_menu2").style.borderBottomRightRadius =
        "5px";
      document.querySelector("#sep_menu3").style.borderTopRightRadius = "5px";
      document.querySelector("#sep_menu3").style.borderBottomRightRadius = 0;
      document.querySelector("#sep_menu4").style.borderRadius = 0;
      document.querySelector("#sep_menu5").style.borderRadius = 0;
    }
    document.querySelector("#inbox svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#archived svg path").style.fill =
      rs.getPropertyValue("--first-alpha-color");
    document.querySelector("#sent svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");
    document.querySelector("#compose svg path").style.fill =
      rs.getPropertyValue("--gray-light-color");

    document.querySelector("#inbox1").style.display = "block";
    document.querySelector("#inbox2").style.display = "none";
    document.querySelector("#archived1").style.display = "none";
    document.querySelector("#archived2").style.display = "block";
    document.querySelector("#sent1").style.display = "block";
    document.querySelector("#sent2").style.display = "none";
    document.querySelector("#compose1").style.display = "block";
    document.querySelector("#compose2").style.display = "none";

    // document.querySelector("#menu11").style.display = "none";
    // document.querySelector("#menu22").style.display = "block";
    // document.querySelector("#menu33").style.display = "none";
    // document.querySelector("#menu44").style.display = "none";

    // alert("ola");
    fetch(`/emails/archive/${a_page}/${j_page}/${d_search}`)
      .then((response) => response.json())
      .then((emails) => {
        // Print emailsdas
        // console.log(emails);
        //console.log(emails.forEach());

        
        if (emails.p_actual == 1 && emails.p_actual == emails.p_last) {
          single_page();
        } else if (emails.p_actual == 1) {
          first_page();
        } else if (emails.p_actual == emails.p_last) {
          last_page();
        } else {
          middle_page();
        }
        actual_page = emails.p_actual;

        
        var emails_parsed = JSON.parse(emails.emails_json);
        var users_parsed = JSON.parse(emails.users_json);

        
        // console.log(emails_parsed);
        // console.log(users_parsed);
        emails_parsed.forEach((content) => {
        // emails.forEach((content) => {
          //console.log(content);
          //console.log(content.sender);
          //  alert(content.archived);
          var sender_email = users_parsed.filter(function (entry) {
            return entry.pk == content.fields.sender;
          });
          // const user_log = document.querySelector("#testuser").value;
          // console.log(content.fields.archived);
          if (content.fields.archived) {
          // if (content.archived) {
            /*     document.querySelector('#archived-view').style.display = 'block';
            document.querySelector('#sent-view').style.display = 'none';
            document.querySelector('#inbox-view').style.display = 'none';
            document.querySelector('#compose-view').style.display = 'none';
        */ //document.querySelector("#sent-to").innerHTML = content.recipients;
            //document.querySelector("#sent-subject").innerHTML = content.subject;
            //document.querySelector("#sent-body").innerHTML = content.body;

            // content.fields.recipients = content.fields.recipients.toString();
            // if (content.fields.recipients.length > 27)
            //   content.fields.recipients =
            //     content.fields.recipients.substring(0, 27) + "...";
            // if (content.fields.subject.length > 45)
            //   content.fields.subject =
            //     content.fields.subject.substring(0, 45) + "...";

            const post = document.createElement("div");
            post.id = "email";
            post.className = "email";
            // content.fields.sender = content.fields.sender.toString();
            sender_email[0].fields.email =
              sender_email[0].fields.email.toString();

            
            if (screen.width < 768) {
              if (sender_email[0].fields.email.length > 17)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                sender_email[0].fields.email =
                  sender_email[0].fields.email.substring(0, 17) + "...";
              if (content.fields.subject.length > 20)
                content.fields.subject =
                  content.fields.subject.substring(0, 20) + "...";
            } else if (screen.width < 1024) {
              if (sender_email[0].fields.email.length > 20)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                sender_email[0].fields.email =
                  sender_email[0].fields.email.substring(0, 20) + "...";
              if (content.fields.subject.length > 23)
                content.fields.subject =
                  content.fields.subject.substring(0, 23) + "...";
            } else {
              if (sender_email[0].fields.email.length > 30)
                // content.fields.sender =
                //   content.fields.sender.substring(0, 14) + "...";
                sender_email[0].fields.email =
                  sender_email[0].fields.email.substring(0, 30) + "...";
              if (content.fields.subject.length > 35)
                content.fields.subject =
                  content.fields.subject.substring(0, 35) + "...";
            }

            //post.className = 'archived';
            /*post.innerHTML = `<div><p><b>Recipients:</b> ${content.recipients}<br/>
                              <b>Subject:</b> ${content.subject}}<br/>
                              <b>Date:</b> ${content.timestamp}</p>
                              <button class="unarchive_email" data-id=${content.id}>Unarchive</button></div>`;
             */
            let svg_inbox;
            if (content.fields.read) {
              // post.style.backgroundColor = "#E6E6E6";
              svg_inbox = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.9438 10.21L15.6938 2.71001C15.4885 2.57323 15.2473 2.50024 15.0006 2.50024C14.7539 2.50024 14.5128 2.57323 14.3075 2.71001L3.0575 10.21C2.88612 10.3241 2.74556 10.4787 2.64831 10.6601C2.55105 10.8415 2.50011 11.0442 2.5 11.25V25C2.5 26.3788 3.62125 27.5 5 27.5H25C26.3788 27.5 27.5 26.3788 27.5 25V11.25C27.5 10.8325 27.2913 10.4425 26.9438 10.21ZM15 5.25251L23.9963 11.25L15 17.2475L6.00375 11.25L15 5.25251ZM5 25V13.5863L14.3062 19.79C14.5117 19.9271 14.7531 20.0002 15 20.0002C15.2469 20.0002 15.4883 19.9271 15.6938 19.79L25 13.5863L24.9962 25H5Z" fill="#001A83"/></svg>`;
            } else {
              svg_inbox = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25 5H5C3.62125 5 2.5 6.12125 2.5 7.5V22.5C2.5 23.8788 3.62125 25 5 25H25C26.3788 25 27.5 23.8788 27.5 22.5V7.5C27.5 6.12125 26.3788 5 25 5ZM25 7.5V8.13875L15 15.9175L5 8.14V7.5H25ZM5 22.5V11.305L14.2325 18.4862C14.4514 18.6582 14.7217 18.7516 15 18.7516C15.2783 18.7516 15.5486 18.6582 15.7675 18.4862L25 11.305L25.0025 22.5H5Z" fill="#001A83"/> </svg>`;
            }
            const timestampFormatted = dateFormat(content.fields.timestamp, "list");
            
            post.innerHTML = `
                              <div id="left-content" onclick = "load_mailbox('/emails/${content.pk}')" >
                                ${svg_inbox}
                                <div id="sender-and-subject">
                                  <div id="first_column"><b> ${sender_email[0].fields.email}</b></div>
                                  <div id="second_column"><b>${content.fields.subject}</b></div>
                                 </div>
                              </div>
                              <div id="time-and-archive">
                                  <div id="third_column">${timestampFormatted}</div>
                                  <svg  class="unarchive_svg" value="${content.pk}" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path class="unarchive_svg" value="${content.pk}" d="M15.8334 8.44328V3.44328C15.8334 2.52411 15.0859 1.77661 14.1667 1.77661H5.83341C4.91425 1.77661 4.16675 2.52411 4.16675 3.44328V18.3333L10.0001 14.4449L15.8334 18.3333V8.44328Z" fill="#001A83"/>
                                  </svg>
                              </div>`;
            //post.innerHTML = `<b>Recipients:</b> ${content.recipients}<br/><b>Subject:</b> ${content.subject}<br/><b>Body:</b> ${content.body}<br/><b>Date:</b> ${content.timestamp}</p>`;
            //document.querySelector('#archived-posts').append(post);
            // if (content.fields.read) {
            //   post.style.backgroundColor = "#E6E6E6";
            //   //post.style.boxShadow = "3px 3px";
            // }

            // post.addEventListener("click", (event) => {
            //   const element = event.target;
            //   //console.log(element);
            //   if (element.className !== "unarchive_email") {
            //     load_mailbox(`/emails/${content.fields.id}`);
            //   }
            // });

            document.querySelector("#archived-view").append(post);
            // space_emails = document.createElement("br");  
            // document.querySelector("#archived-view").appendChild(space_emails);
          }
        });
        // ... do something else with emails ...
      });
    // document.querySelector("#archived-view").innerHTML = `<h3>${
    //   mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    // }</h3>`;
    document.querySelector("#archived-view").innerHTML = ` `;
  } else if (submailbox === "emails") {
    // alert("no se porque entra aca");
    //  alert(mailbox);

    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#archived-view").style.display = "none";
    document.querySelector("#sent-view").style.display = "none";
    document.querySelector("#inbox-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";

    // document.querySelector("#menu1").style.display = "none";
    // document.querySelector("#menu2").style.display = "block";
    // document.querySelector("#menu3").style.display = "none";
    // document.querySelector("#menu4").style.display = "none";

    document.querySelector(".pagination").style.display = "none";
    // document.querySelector("#lookup-form").style.display = "none";


    fetch(mailbox)
      .then((response) => response.json())
      .then((email) => {
        // Print email
        //  console.log(email);
        //PUT request to /emails/<email_id></email_id>
        fetch(mailbox, {
          method: "PUT",
          body: JSON.stringify({
            read: true,
          }),
        });
        let id_archived_email = "unarchive_email";
        let tag_archived_email = "Unarchive";

        if (email.archived) {
          //alert("esta archivado");
          id_archived_email = "unarchive_email";
          tag_archived_email = "Unarchive";
        } else {
          //alert("no esta archivado");
          id_archived_email = "archive_email";
          tag_archived_email = "Archive";
        }

        const timestampFormatted = dateFormat(email.timestamp, "email");
            
        // console.log(email.timestamp);
        // console.log(timestampFormatted);

        //const user_log = document.querySelector('#testuser').value;
        //alert(user_log);
        let display_buttons="flex";
        if (email.sender == document.querySelector("#testuser").value)
          display_buttons = "none";
        const post = document.createElement("div");
        //post.id=('email');
        post.innerHTML = `<div class="email_view">
                              <div class="btns" style="display:${display_buttons};">
                                <a class="btn btn-next btn-svg" id="reply" data-sender="${email.sender}" data-subject="${email.subject}" data-timestamp="${email.timestamp}" data-body="${email.body}" ><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.4615 17.4615H31.6154V36.3077H37V14.7692C37 14.0552 36.7163 13.3704 36.2114 12.8655C35.7065 12.3606 35.0217 12.0769 34.3077 12.0769H15.4615V4L2 14.7692L15.4615 25.5385V17.4615Z" fill="#F3F3F3"/></svg>Reply</a>
                                <a class="btn btn-next btn-svg" id=${id_archived_email} data-id=${email.id} ><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30.0001 3.33325H10.0001C8.16175 3.33325 6.66675 4.82825 6.66675 6.66659V36.6666L20.0001 29.0466L33.3334 36.6666V6.66659C33.3334 4.82825 31.8384 3.33325 30.0001 3.33325ZM30.0001 30.9216L20.0001 25.2083L10.0001 30.9216V6.66659H30.0001V30.9216Z" fill="#F3F3F3"/>
                                </svg>${tag_archived_email}</a>
                              </div>
                              <aside class="email-details"> 
                                <p class="b-small">From:</p><p> ${email.sender} </p>
                                <p class="email-date"> ${timestampFormatted} </p>
                                <p class="b-small"> To:</p><p class="email-recipients">  ${email.recipients} </p>
                                <p class="b-small"> Subject:</p><p class="email-subject">  ${email.subject} </p>
                              </aside>
                              <hr>
                              <p> ${email.body} </p>
                            </div>`;

        /*  post.addEventListener('click', event => {
        const element = event.target; 
        console.log(element);
        if(element.className !== 'reply'){
          load_mailbox(`/emails/${content.id}`)
        }
      });*/

        document.querySelector("#emails-view").append(post);

        // ... do something else with email ...
      });

    // document.querySelector("#emails-view").innerHTML = `<h3>Email</h3>`;
    document.querySelector("#emails-view").innerHTML = ` `;
  } else {
    mailbox = "Error";
    fetch(`/emails/${mailbox}`)
      .then((response) => response.json())
      .then((emails) => {
        console.log(emails);
      });
  }
}

// Searching
// Search by pressing enter
document.getElementById("lookup-form").onsubmit = searching;
// Clean search when the input is empty (when press the x too)
document.getElementById("search").addEventListener("input", (e) => {
  if (e.currentTarget.value == "") searching();
});
// Search by clicking the magnifying glass icon
document.querySelector("#submitSearch").addEventListener("click", searching);
// The function Search
function searching() {
  datos_buscados = document.getElementById("search").value.toLowerCase();
  const post = document.querySelectorAll("#email");
  // console.log(post);
  // console.log(post.length);
  // for (var i = 0, ilen = post.length; i < ilen; i++) {
  //   let remitente = post[i]
  //     .querySelector("#first_column")
  //     .textContent.toLowerCase();
  //   let asunto = post[i]
  //     .querySelector("#second_column")
  //     .textContent.toLowerCase();
  //   let fecha = post[i]
  //     .querySelector("#third_column")
  //     .textContent.toLowerCase();
  //   if (
  //     remitente.includes(datos_buscados) ||
  //     asunto.includes(datos_buscados) ||
  //     fecha.includes(datos_buscados)
  //   ) {
  //     // post[i].style.display = "block";
  //     post[i].style.display = "flex";
  //   } else {
  //     post[i].style.display = "none";
  //   }
  // }
  // console.log(datos_buscados);
  if (datos_buscados.length== 0){
    // console.log("relakakaka");
    datos_buscados="nullnullnull";
  }
  setTimeout(() => load_mailbox(actual_view, actual_page, 0, datos_buscados), 100);


  return false;
}

var current = new Date();

//  Date format
function dateFormat(mailDate, mode) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  current = new Date();
  // console.log(" ");

  // Output: Tue, July 21, 2020, 10:01:14 AM

  const currentDay = current.getDate();
  const currentMonth = current.getMonth() + 1;
  const currentYear = current.getFullYear();
  const currentHour = current.getHours();
  const currentMinutes = current.getMinutes();
  console.log("currentDay: " + currentDay);
  console.log("currentMonth: " + currentMonth);
  console.log("currentYear: " + currentYear);
  console.log("currentHour: " + currentHour);
  console.log("currentMinutes: " + currentMinutes);

  // console.log(current.getMonth());
  // console.log(mailDate);
  const dayMail = mailDate.substr(8, 2);
  const monthMail = mailDate.substr(5, 2);
  const yearMail = mailDate.substr(0, 4);
  const hourMail = mailDate.substr(11, 2);
  const minutesMail = mailDate.substr(14, 2);
  const hourMinutesMail = mailDate.substr(11, 5);

  // console.log(parseInt(monthMail));
  // console.log(months[parseInt(monthMail) - 1]);
  const monthLMail = months[parseInt(monthMail) - 1];

  console.log("***----------******* ");
  console.log("dayMail: " + dayMail);
  console.log("monthMail: " + monthMail);
  console.log("yearMail: " + yearMail);
  console.log("monthLMail: " + monthLMail);
  console.log("hourMail: " + hourMail);
  console.log("minutesMail: " + minutesMail);

  // console.log(
  //   current.toLocaleString("en-US", {
  //     weekday: "short", // long, short, narrow
  //     day: "numeric", // numeric, 2-digit
  //     year: "numeric", // numeric, 2-digit
  //     // month: "long", // numeric, 2-digit, long, short, narrow
  //     month: "short", // numeric, 2-digit, long, short, narrow
  //     hour: "numeric", // numeric, 2-digit
  //     minute: "numeric", // numeric, 2-digit
  //     second: "numeric", // numeric, 2-digit
  //   })
  // );

  // console.log("***************** ");

  var mailDateFormatted = new String();
  if(mode == "list"){
    // console.log("entra al modo list");
    if (currentYear == yearMail){
      if(currentMonth == monthMail && currentDay == dayMail){
        mailDateFormatted = hourMinutesMail;
      }
      else{
        mailDateFormatted = dayMail + " " + monthLMail;
      }
    }
    else {
      mailDateFormatted = dayMail + "/" + monthMail + "/" + yearMail;
    }
  }
  else if(mode == "email"){
    // console.log("entra al modo email");
    // mailDateFormatted =  mailDateFormatted  + " " + hourMail ;
    if (currentYear == yearMail && currentMonth == monthMail && currentDay == dayMail){
      if(currentHour == hourMail){
        // console.log("entra al primer if, mismo dia y hora");
        mailDateFormatted = parseInt(currentMinutes) - parseInt(minutesMail);
        mailDateFormatted = mailDateFormatted + " minutes ago";
      }
      else{
        
        // console.log("entra al primer else, mismo dia")
        mailDateFormatted = dayMail + " " + monthLMail;
        mailDateFormatted = parseInt(currentHour) - parseInt(hourMail);
        mailDateFormatted = mailDateFormatted + " hours ago";
      }
    }
    else {
      // console.log("entra al segundo else, otro dia")
      mailDateFormatted = dayMail + "/" + monthMail + "/" + yearMail;
    }
  }
  return mailDateFormatted;
  // minutesMail  currentMinutes
  // currentHour == hourMail && 
}

function first_page() {
  document.getElementById("arrow-first-page").disabled = true;
  document.querySelector("#arrow-first-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-first-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });
  document.getElementById("arrow-prev-page").disabled = true;
  document.querySelector("#arrow-prev-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-prev-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });

  document.getElementById("arrow-next-page").disabled = false;
  document.querySelector("#arrow-next-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-next-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });
  document.getElementById("arrow-last-page").disabled = false;
  document.querySelector("#arrow-last-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-last-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });
}
function last_page() {
  document.getElementById("arrow-first-page").disabled = false;
  document.querySelector("#arrow-first-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-first-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });
  document.getElementById("arrow-prev-page").disabled = false;
  document.querySelector("#arrow-prev-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-prev-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });

  document.getElementById("arrow-next-page").disabled = true;
  document.querySelector("#arrow-next-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-next-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });
  document.getElementById("arrow-last-page").disabled = true;
  document.querySelector("#arrow-last-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-last-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });
}
function middle_page() {
  document.getElementById("arrow-first-page").disabled = false;
  document.querySelector("#arrow-first-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-first-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });

  document.getElementById("arrow-prev-page").disabled = false;
  document.querySelector("#arrow-prev-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-prev-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });

  document.getElementById("arrow-next-page").disabled = false;
  document.querySelector("#arrow-next-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-next-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });
  document.getElementById("arrow-last-page").disabled = false;
  document.querySelector("#arrow-last-page svg").style.fill =
    rs.getPropertyValue("--first-color");
  document
    .querySelector("#arrow-last-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "pointer";
    });
}
function single_page() {
  document.getElementById("arrow-first-page").disabled = true;
  document.querySelector("#arrow-first-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-first-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });

  document.getElementById("arrow-prev-page").disabled = true;
  document.querySelector("#arrow-prev-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-prev-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });

  document.getElementById("arrow-next-page").disabled = true;
  document.querySelector("#arrow-next-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-next-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });
  document.getElementById("arrow-last-page").disabled = true;
  document.querySelector("#arrow-last-page svg").style.fill =
    rs.getPropertyValue("--gray-color");
  document
    .querySelector("#arrow-last-page svg")
    .addEventListener("mouseover", function (event) {
      event.target.style.cursor = "default";
    });

  //     #arrow-first-page:hover,
  // #arrow-prev-page:hover,
  // #arrow-next-page:hover,
  // #arrow-last-page:hover{
  //   cursor: pointer;}
}

// function load_max(event){
//   alert("holis");
//   if (event.stopPropagation) {
//     event.stopPropagation();
//   }
// }
