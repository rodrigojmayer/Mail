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
from django.core import serializers


from .models import User, Email










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
def mailbox(request, mailbox, num_page):

    print(num_page)
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


    p = Paginator(emails, 10)
    # if 
    #             emails = Email.objects.filter(
    #         user=request.user, recipients=request.user, archived=True
    #     )
    # print(p)
    # print(p.count)
    # print(p.num_pages)
    # # for e in p:
      # print(e)
      # print(e.subject)
      # e.pepito = "holapepe"

      
    # for e in emails.all():
    #   print(e)
    #   print(e.subject)
    #   e.subject = "nopuedeser"
    #   print(e.subject)
    #   print(emails)
    
    # print(emails[0])
    # print(p.count)
    # print(p.num_pages)
    page1 = p.page(num_page)
    # print(page1)
    # print(page1.object_list)
    emails = page1.object_list
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


    return JsonResponse([email.serialize() for email in emails], safe=False)
    # return JsonResponse([emails], safe=False)


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
