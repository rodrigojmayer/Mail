from django.contrib.auth.models import AbstractUser
from django.db import models
# from django.core import ModelSerializer 
# from django.core import serializers
# from rest_framework import serializers
# from django.core import serializers as core_serializers


class User(AbstractUser):
    pass


class Email(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="emails")
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="emails_sent")
    recipients = models.ManyToManyField("User", related_name="emails_received")
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.email,
            # "sender": self.sender.email,
            "recipients": [user.email for user in self.recipients.all()],
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %H:%M %p, %m"),
            # "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "read": self.read,
            "archived": self.archived
        }

    def __str__(self):
      # return f'"id": {self.id}, "id_sender": {self.sender.id},"sender": "{self.sender}", "id_recipients":  {[(user.id) for user in self.recipients.all()]}, "recipients":  {[(user.email) for user in self.recipients.all()]}, "subject": "{self.subject}", "body": "{self.body}"'
      
      return f'"id": {self.id}, "id_sender": {self.sender.id},"sender": "{self.sender}", "id_recipients":  {[(user.id) for user in self.recipients.all()]}, "recipients":  {[(user.email) for user in self.recipients.all()]}, "subject": "{self.subject}", "archived": "{self.archived}"'


# class UserSerializer(serializers.BadSerializer):
#     emails =core_serializers.serialize('json', [ Email ,])

#     class Meta:
#         model = User
#         fields = ['id', 'user', 'emails']