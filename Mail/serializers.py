# from rest_framework import serializers

# from django.core import serializers
# from .models import User, Email
# # from .models import Article, AuthorsOrder


# class EmailSerializer(serializers.ModelSerializer):
#     sender = serializers.ReadOnlyField(source='user.id')

#     class Meta:
#         model = Email
#         fields = ('subject', 'sender')


# class UserSerializer(serializers.ModelSerializer):
#     user = EmailSerializer(source='email_set', many=True)

#     class Meta:
#         model = User
#         fields = ('id', 'user')