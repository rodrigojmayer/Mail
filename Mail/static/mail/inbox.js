var rs = getComputedStyle(document.querySelector(":root"));

document.addEventListener("DOMContentLoaded", function () {
  // var r = document.querySelector(":root");
  //var rs = getComputedStyle(document.querySelector(":root"));

  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
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
      setTimeout(() => load_mailbox("inbox"), 100);
    } else if (element.id === "unarchive_email") {
      fetch(`/emails/${element.dataset.id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: false,
        }),
      });
      //load_mailbox('inbox');
      setTimeout(() => load_mailbox("inbox"), 100);
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
  });

  document.querySelector(".logo-user").addEventListener("click", () => {
    document.querySelector(".modal-logout").style.opacity = 1;
    document.querySelector(".modal-logout").style.pointerEvents = "auto";
  });
  document.querySelector("#cancel-logout").addEventListener("click", () => {
    document.querySelector(".modal-logout").style.opacity = 0;
    document.querySelector(".modal-logout").style.pointerEvents = "none";
  });


  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email(reply_data) {
  // Show compose view and hide other views
  document.querySelector("#inbox-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  document.querySelector("#sent-view").style.display = "none";
  document.querySelector("#archived-view").style.display = "none";
  document.querySelector("#emails-view").style.display = "none";

  document.querySelector("#menu1").style.display = "none";
  document.querySelector("#menu2").style.display = "none";
  document.querySelector("#menu3").style.display = "none";
  document.querySelector("#menu4").style.display = "block";
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

  document.querySelector("#menu11").style.display = "none";
  document.querySelector("#menu22").style.display = "none";
  document.querySelector("#menu33").style.display = "none";
  document.querySelector("#menu44").style.display = "block";

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
  //document.querySelector('#send_email').addEventListener('click', () => {
  document.querySelector("form").onsubmit = () => {
    // alert(document.querySelector('#compose-recipients').value);
    // alert(document.querySelector('#compose-subject').value);
    // alert(document.querySelector('#compose-body').value);

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
        load_mailbox("sent");
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

function load_mailbox(mailbox) {
  // grab element you want to hide
  //const elem = document.querySelector('#hint');
  // remove element
  // elem.parentNode.removeChild(elem);
  //mailbox="reloko";
  //mailbox=1;
  //alert(`Mailbox: ${mailbox}`);
  const submailbox = mailbox.substring(1, 7);
  //alert(`mailbox: ${mailbox}`);
  //alert(`llega hasta aca: ${submailbox}`);
  if (mailbox === "inbox") {
    document.querySelector("#inbox-view").style.display = "block";
    document.querySelector("#sent-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#archived-view").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";

    // var rs = getComputedStyle(document.querySelector(":root"));

    document.querySelector("#menu1").style.display = "block";
    document.querySelector("#menu2").style.display = "none";
    document.querySelector("#menu3").style.display = "none";
    document.querySelector("#menu4").style.display = "none";

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

    document.querySelector("#menu11").style.display = "block";
    document.querySelector("#menu22").style.display = "none";
    document.querySelector("#menu33").style.display = "none";
    document.querySelector("#menu44").style.display = "none";

    fetch("/emails/inbox")
      .then((response) => response.json())
      .then((emails) => {
        // Print emails
        //console.log(emails);
        //console.log(emails.forEach());
        emails.forEach((content) => {
          //console.log(content);
          //console.log(content.sender);
          const user_log = document.querySelector("#testuser").value;
          //alert(user_log);
          content.recipients.forEach((cont) => {
            if (cont === user_log) {
              /*      document.querySelector('#inbox-view').style.display = 'block';
              document.querySelector('#sent-view').style.display = 'none';
              document.querySelector('#compose-view').style.display = 'none';
              document.querySelector('#archived-view').style.display = 'none';
        */ /*   console.log(`El cont es: ${cont}`);
              console.log(`Sender: ${content.sender}`);
              console.log(`Subject: ${content.subject}`);
              console.log(`Body: ${content.body}`);
              console.log(`Read: ${content.read}`);
              console.log(`Archived: ${content.archived}`);
          */ //alert("OK");

              const post = document.createElement("div");
              post.id = "email";
              post.className = "email";
              //  post.class=('class_email');
              //post.className = 'posti';
              //post.innerHTML = "Sender: "+content.sender+"<br/>Subject: "+content.subject+"<br/>Body: "+content.body+"<br/><br/>";
              //timestamp
              //post.innerHTML = `<p>Sender: ${content.sender}<br/>Subject: ${content.subject}<br/>Body: ${content.body}<br/><br/></p>`;
              /*post.innerHTML = `<div><p><b>Sender:</b> ${content.sender}<br/>
                                <b>Subject:</b> ${content.subject}<br/>
                                <b>Date:</b> ${content.timestamp}</p>
                                <button class="archive_email" data-id=${content.id}>Archive</button></div>`;
              */
              content.sender = content.sender.toString();
              if (content.sender.length > 27)
                content.sender = content.sender.substring(0, 27) + "...";
              if (content.subject.length > 45)
                content.subject = content.subject.substring(0, 45) + "...";

              post.innerHTML = `<div><div id="first_column"> <b>${content.sender}</b></div>
                                <div id="second_column"><b>${content.subject}</b></div>
                                <div id="third_column">${content.timestamp}</div></div>`;
              //post.innerHTML = `${content.id}<p><b>Sender:</b> ${content.sender}<br/><b>Subject:</b> ${content.subject}<br/><b>Body:</b> ${content.body}<br/><b>Date:</b> ${content.timestamp}</p>`;

              if (content.read) {
                post.style.backgroundColor = "#E6E6E6";
                // post.style.boxShadow = "0 3px ";
              }
              //  post.style.border = " solid black";
              //  post.style.borderCollapse = "separate";
              //  console.log(post);

              post.addEventListener("click", (event) => {
                //const element = event.target;
                //console.log(element);
                // if(element.className !== 'archive_email'){
                load_mailbox(`/emails/${content.id}`);
                // }
              });

              document.querySelector("#inbox-view").append(post);
              space_emails = document.createElement("br");
              document.querySelector("#inbox-view").appendChild(space_emails);
            }
          });
        });
        // ... do something else with emails ...
      });
    document.querySelector("#inbox-view").innerHTML = `<h3>${
      mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }</h3>`;
  } else if (mailbox === "sent") {
    document.querySelector("#sent-view").style.display = "block";
    document.querySelector("#inbox-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#archived-view").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";

    document.querySelector("#menu1").style.display = "none";
    document.querySelector("#menu2").style.display = "none";
    document.querySelector("#menu3").style.display = "block";
    document.querySelector("#menu4").style.display = "none";
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

    document.querySelector("#menu11").style.display = "none";
    document.querySelector("#menu22").style.display = "none";
    document.querySelector("#menu33").style.display = "block";
    document.querySelector("#menu44").style.display = "none";

    fetch("/emails/sent")
      .then((response) => response.json())
      .then((emails) => {
        // Print emails
        //console.log(`Emails: ${emails}`);
        //console.log(emails.forEach());
        emails.forEach((content) => {
          //console.log(content);
          //console.log(content.sender);
          const user_log = document.querySelector("#testuser").value;
          //alert(user_log);
          if (content.sender === user_log) {
            /*       document.querySelector('#sent-view').style.display = 'block';
            document.querySelector('#inbox-view').style.display = 'none';
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#archived-view').style.display = 'none';
      */ //document.querySelector("#sent-to").innerHTML = content.recipients;
            //document.querySelector("#sent-subject").innerHTML = content.subject;
            // document.querySelector("#sent-body").innerHTML = content.body;

            const post = document.createElement("div");
            post.id = "email";
            // post.className = 'post';
            //post.innerHTML = "Recipients: "+content.recipients+"<br/>Subject: "+content.subject+"<br/>Body: "+content.body+"<br/><br/>";
            /*post.innerHTML = `<p><b>Recipients:</b> ${content.recipients}<br/>
                              <b>Subject:</b> ${content.subject}<br/>
                              <b>Date:</b> ${content.timestamp}</p>`;
          */
            content.recipients = content.recipients.toString();
            if (content.recipients.length > 27)
              content.recipients = content.recipients.substring(0, 27) + "...";

            /*console.log(content);
            console.log(content.sender);
            console.log(content.subject);
            console.log(content.body);*/

            if (content.subject.length > 45)
              content.subject = content.subject.substring(0, 45) + "...";

            post.innerHTML = `<div id="first_column"> <b>${content.recipients}</b></div>
                              <div id="second_column"><b>${content.subject}</b></div>
                              <div id="third_column">${content.timestamp}</div>`;
            //  post.innerHTML = `<p><b>Recipients:</b> ${content.recipients}<br/><b>Subject:</b> ${content.subject}<br/><b>Body:</b> ${content.body}<br/><b>Date:</b> ${content.timestamp}</p>`;
            //    if(content.read){
            //        post.style.backgroundColor = "LightGray";
            //        post.style.boxShadow = "3px 3px";
            //      }

            post.addEventListener("click", (event) => {
              //const element = event.target;
              //console.log(element);
              // if(element.className !== 'archive_email'){
              load_mailbox(`/emails/${content.id}`);
              // }
            });
            document.querySelector("#sent-view").append(post);
            space_emails = document.createElement("br");
            document.querySelector("#sent-view").appendChild(space_emails);
          }
        });
        // ... do something else with emails ...
      });
    document.querySelector("#sent-view").innerHTML = `<h3>${
      mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }</h3>`;
  } else if (mailbox === "archive") {
    document.querySelector("#archived-view").style.display = "block";
    document.querySelector("#sent-view").style.display = "none";
    document.querySelector("#inbox-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";

    document.querySelector("#menu1").style.display = "none";
    document.querySelector("#menu2").style.display = "block";
    document.querySelector("#menu3").style.display = "none";
    document.querySelector("#menu4").style.display = "none";
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

    document.querySelector("#menu11").style.display = "none";
    document.querySelector("#menu22").style.display = "block";
    document.querySelector("#menu33").style.display = "none";
    document.querySelector("#menu44").style.display = "none";

    // alert("ola");
    fetch("/emails/archive")
      .then((response) => response.json())
      .then((emails) => {
        // Print emails
        //.log(emails);
        //console.log(emails.forEach());
        emails.forEach((content) => {
          //console.log(content);
          //console.log(content.sender);
          //  alert(content.archived);
          const user_log = document.querySelector("#testuser").value;
          if (content.archived) {
            /*     document.querySelector('#archived-view').style.display = 'block';
            document.querySelector('#sent-view').style.display = 'none';
            document.querySelector('#inbox-view').style.display = 'none';
            document.querySelector('#compose-view').style.display = 'none';
        */ //document.querySelector("#sent-to").innerHTML = content.recipients;
            //document.querySelector("#sent-subject").innerHTML = content.subject;
            //document.querySelector("#sent-body").innerHTML = content.body;

            content.recipients = content.recipients.toString();
            if (content.recipients.length > 27)
              content.recipients = content.recipients.substring(0, 27) + "...";
            if (content.subject.length > 45)
              content.subject = content.subject.substring(0, 45) + "...";

            const post = document.createElement("div");
            post.id = "email";
            //post.className = 'archived';
            /*post.innerHTML = `<div><p><b>Recipients:</b> ${content.recipients}<br/>
                              <b>Subject:</b> ${content.subject}}<br/>
                              <b>Date:</b> ${content.timestamp}</p>
                              <button class="unarchive_email" data-id=${content.id}>Unarchive</button></div>`;
             */
            post.innerHTML = `<div id="first_column"><b> ${content.recipients}</b></div>
                              <div id="second_column"><b>${content.subject}</b></div>
                              <div id="third_column">${content.timestamp}</div>`;
            //post.innerHTML = `<b>Recipients:</b> ${content.recipients}<br/><b>Subject:</b> ${content.subject}<br/><b>Body:</b> ${content.body}<br/><b>Date:</b> ${content.timestamp}</p>`;
            //document.querySelector('#archived-posts').append(post);
            if (content.read) {
              post.style.backgroundColor = "#E6E6E6";
              //post.style.boxShadow = "3px 3px";
            }

            post.addEventListener("click", (event) => {
              const element = event.target;
              //console.log(element);
              if (element.className !== "unarchive_email") {
                load_mailbox(`/emails/${content.id}`);
              }
            });

            document.querySelector("#archived-view").append(post);
            space_emails = document.createElement("br");
            document.querySelector("#archived-view").appendChild(space_emails);
          }
        });
        // ... do something else with emails ...
      });
    document.querySelector("#archived-view").innerHTML = `<h3>${
      mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }</h3>`;
  } else if (submailbox === "emails") {
    //alert(mailbox);

    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#archived-view").style.display = "none";
    document.querySelector("#sent-view").style.display = "none";
    document.querySelector("#inbox-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";

    // document.querySelector("#menu1").style.display = "none";
    // document.querySelector("#menu2").style.display = "block";
    // document.querySelector("#menu3").style.display = "none";
    // document.querySelector("#menu4").style.display = "none";

    fetch(mailbox)
      .then((response) => response.json())
      .then((email) => {
        // Print email
        console.log(email.body);
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
        let display_buttons = "inline-block";

        //const user_log = document.querySelector('#testuser').value;
        //alert(user_log);
        if (email.sender == document.querySelector("#testuser").value)
          display_buttons = "none";
        const post = document.createElement("div");
        //post.id=('email');
        post.innerHTML = `<div class="email_view">
                          <table>
                            <tr>
                              <th >From:</th> <td>  ${email.sender}</td>
                            </tr>
                            <tr>
                              <th >To:</th> <td>  ${email.recipients}</td>
                            </tr>
                            <tr>
                              <th>Subject:</th> <td>  ${email.subject}</td>
                            </tr>
                          </table>
                        </div>
                        <div class="email_view2"><b>Date:&emsp;</b> ${email.timestamp}<br/>
                          <div class="buttons">
                            <button class="btn btn-sm btn-outline-primary" id="reply" data-sender="${email.sender}" data-subject="${email.subject}" data-timestamp="${email.timestamp}" data-body="${email.body}" style="display:${display_buttons};">Reply</button>
                            <button class="btn btn-sm btn-outline-primary" id=${id_archived_email} data-id=${email.id} style="display:${display_buttons};">${tag_archived_email}</button>
                          </div>
                        </div><br/>
                        <hr>
                         <div class="email_view3">${email.body}</div><br/>`;

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

    document.querySelector("#emails-view").innerHTML = `<h3>Email</h3>`;
  } else {
    mailbox = "Error";
    fetch(`/emails/${mailbox}`)
      .then((response) => response.json())
      .then((emails) => {
        console.log(emails);
      });
  }

  /*
  fetch('/emails/3')
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
  
      // ... do something else with email ...
  });*/

  // Show the mailbox and hide other views
  /*  document.querySelector('#inbox-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#sent-view').style.display = 'none';
  document.querySelector('#archived-view').style.display = 'none';
 */
  // Show the mailbox name
  //  document.querySelector('#inbox-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // if (window.matchMedia("screen and (min-width: 1024px)").matches) {
  //   document.querySelector(".menu-background-mobile").style.display = "none";
  // }
}
// function funcionpepito() {
//   if (window.matchMedia("screen and (min-width: 1024px)").matches) {
//     document.querySelector(".menu-background-mobile").style.display = "none";
//   }
// }

// setTimeout(() => funcionpepito(), 100);
