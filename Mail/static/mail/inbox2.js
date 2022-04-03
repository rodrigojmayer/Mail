document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);



  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
  //document.querySelector('#send_email').addEventListener('click', () => {
  document.querySelector('form').onsubmit = () => {
   // alert(document.querySelector('#compose-recipients').value);
   // alert(document.querySelector('#compose-subject').value);
   // alert(document.querySelector('#compose-body').value);
   
    var rec = document.querySelector('#compose-recipients').value;
    var sub = document.querySelector('#compose-subject').value;
    var bod = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: rec,
          subject: sub,
          body: bod
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        alert("Alerta roja");
        load_mailbox('sent');
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

  //alert("Mailbox"+mailbox);
  if(mailbox === 'inbox'){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        //console.log(emails);
        //console.log(emails.forEach());
         emails.forEach((content)=>{
          //console.log(content);
          //console.log(content.sender);
          const user_log = document.querySelector('#testuser').value;
          //alert(user_log);
          content.recipients.forEach((cont)=>{
            if(cont === user_log){
              document.querySelector('#view').style.display = 'block';
              document.querySelector('#compose-view').style.display = 'none';
              console.log(cont);
              console.log(content.sender);
              console.log(content.subject);
              console.log(content.body);
              //alert("OK"); 
              
              const post = document.createElement('div');
              post.className = 'posti';
              post.innerHTML = "Sender: "+content.sender+"<br/>Subject: "+content.subject+"<br/>Body: "+content.body+"<br/><br/>";
              document.querySelector('#iew-posts').append(post);
            }
          })
        });
        // ... do something else with emails ...
    });

  }
  else if(mailbox === 'sent'){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);
        //console.log(emails.forEach());
        emails.forEach((content)=>{
          console.log(content);
          //console.log(content.sender);
          const user_log = document.querySelector('#testuser').value;
          //alert(user_log);
          if(content.sender === user_log){
            document.querySelector('#view-view').style.display = 'block';
            document.querySelector('#compose-view').style.display = 'none';
            //document.querySelector("#sent-to").innerHTML = content.recipients;
            //document.querySelector("#sent-subject").innerHTML = content.subject;
           // document.querySelector("#sent-body").innerHTML = content.body;
            
            const post = document.createElement('div');
            post.className = 'post';
            post.innerHTML = "Recipients: "+content.recipients+"<br/>Subject: "+content.subject+"<br/>Body: "+content.body+"<br/><br/>";
            document.querySelector('#view-posts').append(post);
          }
        });
        // ... do something else with emails ...
    });

  }
  else if(mailbox === 'archive'){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);
        //console.log(emails.forEach());
        emails.forEach((content)=>{
        console.log(content);
        //console.log(content.sender);
        alert(content.archived);
        const user_log = document.querySelector('#testuser').value;
        if(content.archived){
          document.querySelector('#view-view').style.display = 'block';
          document.querySelector('#compose-view').style.display = 'none';
          //document.querySelector("#sent-to").innerHTML = content.recipients;
          //document.querySelector("#sent-subject").innerHTML = content.subject;
          // document.querySelector("#sent-body").innerHTML = content.body;
          
          const post = document.createElement('div');
          post.className = 'archived';
          post.innerHTML = "Recipients: "+content.recipients+"<br/>Subject: "+content.subject+"<br/>Body: "+content.body+"<br/><br/>";
          document.querySelector('#view-posts').append(post);
        }
      });
      // ... do something else with emails ...
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
  document.querySelector('#view-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
          
  // Show the mailbox name
  document.querySelector('#view-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}