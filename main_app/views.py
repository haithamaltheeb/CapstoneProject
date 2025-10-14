from django.shortcuts import render

# Create your views here.

# main_app/views.py



# Import HttpResponse to send text-based responses
from django.http import HttpResponse

# Define the home view function
def home(request):
    # Send a simple HTML response
    return render(request, 'index.html')


def about(request):
    # Send a simple HTML response
    return HttpResponse('<h1>Hello ᓚᘏᗢ</h1>')

"""
def index(request):
    return render(request, 'index.html')

"""
"""
def guitars_html(request):
    return render(request, "guitars/guitars.html", {'guitars' :guitars})

class Guitar:
    def __init__(self, type, description, price):
        self.type = type
        self.description = description
        self.price = price

        #creating list of guitars instances

        guitars = [
            Guitar('ibanez','large nick 22 frits etc',155),
            Guitar('Yamaha','large ndfge frits etc',1455),
            Guitar('Dean','largfghrhdts etc',15215),
            Guitar('Fender','larg77rehkfhs etc',15175)
        ]
        """

def category_guitars(request):
    return render(request, 'index.html')