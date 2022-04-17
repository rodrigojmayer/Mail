import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
# from django.core.paginator import Paginator
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
# from django.core import serializers as core_serializers
from django.core import serializers 


from .models import User, Email
# from .serializers import EmailSerializer, UserSerializer 










def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "mail/inbox.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


@csrf_exempt
@login_required
def compose(request):

    print("---------------Llega hasta aqui------------------")
    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    data = json.loads(request.body)
    emails = [email.strip() for email in data.get("recipients").split(",")]
    if emails == [""]:
        return JsonResponse({
            "error": "At least one recipient required."
        }, status=400)

    # Convert email addresses to users
    recipients = []
    for email in emails:
        try:
            user = User.objects.get(email=email)
            recipients.append(user)
        except User.DoesNotExist:
            return JsonResponse({
                "error": f"User with email {email} does not exist."
            }, status=400)

    # Get contents of email
    subject = data.get("subject", "")
    body = data.get("body", "")

    # Create one email for each recipient, plus sender
    users = set()
    users.add(request.user)
    users.update(recipients)
    for user in users:
        email = Email(
            user=user,
            sender=request.user,
            subject=subject,
            body=body,
            read=user == request.user
        )
        email.save()
        for recipient in recipients:
            email.recipients.add(recipient)
        email.save()

    return JsonResponse({"message": "Email sent successfully."}, status=201)


@login_required
def mailbox(request, mailbox, actual_page,  jump_page):

    # Filter emails returned based on mailbox
    
    # print( Email.objects.all())
    # print("queondaaaaaa")
    # for e in Email.objects.all():
    #   print(e.subject)
      # print(e.subject)

    # print("------Probando paginator 3000------")

    # p = Paginator(Email.objects.all(), 2)
    # print(p.count)
    # print(p.num_pages)
    
    if mailbox == "inbox":
        emails = Email.objects.filter(
            user=request.user, recipients=request.user, archived=False
        )
    elif mailbox == "sent":
        emails = Email.objects.filter(
            user=request.user, sender=request.user
        )
    elif mailbox == "archive":
        emails = Email.objects.filter(
            user=request.user, recipients=request.user, archived=True
        )
    else:
        return JsonResponse({"error": "Invalid mailbox."}, status=400)

    # Return emails in reverse chronologial order
    emails = emails.order_by("-timestamp").all()

    # print("__________---------__________")
    id_users_array = []
    # print(emails)
    for s in emails:
      # print(s.sender.id)
      # print(s.sender)
      if  s.sender.id not in id_users_array :
        id_users_array.append(s.sender.id)
      # print(s.recipients.all())  
      for r in s.recipients.all():
        # print(r.id)
        if r.id not in id_users_array:
          id_users_array.append(r.id)
      # for r in s.recipients:
        # print(r.id)
    
    
    # print(id_users_array)
    
    # print("*-*-*-*-*-*-*-*-")
    users = User.objects.filter(id__in=id_users_array)
    # users = User.objects.all()
    

    # print(users)

    # for i in users:
      # print(i)

    p = Paginator(emails, 10)
    
    # print(actual_page)
    # print(jump_page)
    if(jump_page==12):
      num_page = 1
    elif(jump_page==11):
      num_page = actual_page - 1
    elif(jump_page == 1):
      num_page = actual_page + 1
    elif(jump_page == 2 or actual_page > p.num_pages):
      num_page = p.num_pages
    else:
      num_page = actual_page




    page = p.page(num_page)

    # print(page)
    # print(page.object_list)    
    # print("*****--------*****")
    # print(p.count)
    # print(p.num_pages)

    # # for e in p:
      # print(e)
      # print(e.subject)
      # e.pepito = "holapepe"

    # emails_json = "["
    # for e in emails:
    #   emails_json = emails_json + "{"
    #   print(e)
    #   e = str(e).replace("'", '"')
    #   # e = str(e).replace('\n', "a")
    #   # e = str(e).replace('\\n' , "b")
      
      
    #   print(e)
    #   emails_json = emails_json + str(e)
    #   emails_json = emails_json + "}, "

    # emails_json = emails_json[:-2]
    # emails_json = emails_json + "]"
    # print("***************************************************")
    # print(emails_json)
    # emails_json= emails_json.replace("\\n", "\n").replace("\\t", "\t");
      # print(e.id)
      # print(e.sender)
      # for r in e.recipients.all():
      #   print(r)
      # print(e.subject)
      # print(e.body)
      # print(e.timestamp)
      # print(e.read)
      # print(e.archived)

           
    #   e.subject = "nopuedeser"
    #   print(e.subject)
    #   print(emails)
    
    # print(emails[0])
    # print(p.count)
    # print(p.num_pages)
    # page = p.page(num_page)
    # print(page1)
    # print(page1.object_list)
    # emails = page
    # page2 = p.page(2)
    # print(page2.object_list)
    # print(page2.has_next())
    # print(page2.has_previous())
    # print(page2.has_other_pages())
    # print(page1.next_page_number())
    # print(page2.previous_page_number())
    # print(page2.start_index())
    # print(page2.end_index())
    # print(page1.start_index())
    # print(page1.end_index())

    # page_number = request.GET.get('page')
    # print(page_number)
    # page_obj = p.get_page(page_number)
    # print(page_obj)
    # list_total_pages = True
    # emails = p
    # return render(request, 'mail/inbox.html', {
    #     'page_obj': page_obj,
    #     "list_total_pages":True,})

    # products = Product.objects.all()
    # data is a python list
    # data = json.loads(serializers.serialize('json', emails))
    # d is a dict
    # d = {}
    # # data is a list nested in d
    # d['results'] = emails
    # # more keys for d
    # d['totalPages'] = 10
    # d['currentPage'] = 1
    # # data is a json string representation of the dict
    # emails = json.dumps(d) 
    # data = [email.serialize() for email in emails]
    # return JsonResponse(data, safe=False)
    # return JsonResponse([email.serialize() for email in emails], safe=False)
    # emails_json = serializers.serialize('json', emails)
    users_json = serializers.serialize('json', users)
    p_json = serializers.serialize('json', page.object_list)


    for e in emails:
      # print(e)
      print(e.timestamp)
    #   print(e.sender)
    #   print(e.subject)
    #   # print(e.body)
    #   print(e.timestamp)
    #   print(e.read)
    #   print(e.archived)
    

    # array_of_emails = []
    # for item in emails:
    #     array_of_emails.append([item])
        

    # print("--------------------------------------------")
    
    # for e in array_of_emails:
    #   print(e)
    #   # print(e.id)


    # # return render (request, "map/index.html", {'marker': str(array_of_array)})

    # print("*****************************************************")
    # # emails_json = json.dumps(array_of_emails) 
    # emails_json = json.stringify(array_of_emails);
    # # sample_list = '["1": 1, "2": 3, "3": 6]'

    # # list_to_json_array = json.dumps(sample_list)
    # print(emails_json)
    # # user_serializer = UserSerializer.objects.all()
    # #emails_json = Email.serialize(emails)
    # # print(user_serializer)
    # print("*****************************************************")
    # print("aca estan los emails json:")
    # print (emails_json)
    # print("--------------------------------------------")
    # print("aca estan los paginationson:")
    # print (p)
    # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    # print("aca estan los userjson:")
    # print (users_json)

    # return JsonResponse({"message":"probando",
    #                     "emails_json": emails_json
    #                     }, status=201)
    return JsonResponse({"message":"probando",
                        "emails_json": p_json,
                        "users_json": users_json,
                        "p_actual" : num_page,
                        "p_last" : p.num_pages
                        }, status=201)



@csrf_exempt
@login_required
def email(request, email_id):

    # Query for requested email
    try:
        email = Email.objects.get(user=request.user, pk=email_id)
    except Email.DoesNotExist:
        return JsonResponse({"error": "Email not found."}, status=404)

    # Return email contents
    if request.method == "GET":
        return JsonResponse(email.serialize())

    # Update whether email is read or should be archived
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("read") is not None:
            email.read = data["read"]
        if data.get("archived") is not None:
            email.archived = data["archived"]
        email.save()
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "mail/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "mail/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "mail/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "mail/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "mail/register.html")
