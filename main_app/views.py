from django.shortcuts import render

# Create your views here.

# main_app/views.py



# Import HttpResponse to send text-based responses
from django.http import HttpResponse

# Define the home view function
def home(request):
    # Send a simple HTML response
    return HttpResponse('<h1>Hello VVVVVVVV ᓚᘏᗢ</h1>')

def about(request):
    # Send a simple HTML response
    return HttpResponse('<h1>Hello ᓚᘏᗢ</h1>')
