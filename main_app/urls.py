from django.urls import path
from . import views # Import views to connect routes to view functions

urlpatterns = [
    # Routes will be added here
    
    path('', views.home, name='home'),
    path('category/<str:category_name>/', views.category_products, name='category_products'),
    path('add-product/', views.add_product, name='add_product'),

    
    
    
]