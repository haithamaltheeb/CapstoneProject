from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.db.models import Q, Sum
from .forms import ProductForm, RegisterForm, LoginForm
from .models import Product, Category, Cart, CartItem

# ---------------------------
# Public / Home
# ---------------------------
def home(request):
    products = Product.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    return render(request, 'index.html', {'products': products, 'categories': categories})

# ---------------------------
# Category page - show products by category
# ---------------------------
def category_products(request, category_name):
    try:
        category = Category.objects.filter(name__iexact=category_name).first()
        if not category:
            return render(request, 'category_products.html', {
                'products': [],
                'category_name': 'Category Not Found',
                'error': 'The requested category was not found.'
            })
        products = Product.objects.filter(category=category)
        return render(request, 'category_products.html', {'products': products, 'category_name': category.name})
    except Exception as e:
        return render(request, 'category_products.html', {
            'products': [],
            'category_name': 'Error',
            'error': 'An error occurred while loading the category.'
        })

# ---------------------------
# Admin product add page (optional separate page) + admin only
# ---------------------------
@login_required
def add_product(request):
    if not request.user.is_superuser:
        return redirect('home')
    
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = ProductForm()
    
    categories = Category.objects.all()
    return render(request, 'add_product.html', {
        'form': form,
        'categories': categories
    })

# ---------------------------
# Authentication: register / login / logout
# ---------------------------
def register_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = RegisterForm()
    
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            login(request, user)
            return redirect('home')
    else:
        form = LoginForm()
    
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

# ---------------------------
# Cart: add, view, update, remove
# ---------------------------
@login_required
def add_to_cart(request, product_id):
    # Accepts GET or POST
    product = get_object_or_404(Product, id=product_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('view_cart')

@login_required
def view_cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    items = cart.items.select_related('product').all()
    total = sum(item.subtotal() for item in items)
    return render(request, 'cart.html', {'cart': cart, 'items': items, 'total': total})

@login_required
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    item.delete()
    return redirect('view_cart')

@login_required
def update_cart_item(request, item_id):
    # expects POST with 'quantity'
    if request.method == 'POST':
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        qty = int(request.POST.get('quantity', 1))
        if qty <= 0:
            item.delete()
        else:
            item.quantity = qty
            item.save()
    return redirect('view_cart')

# ---------------------------
# Simple checkout placeholder
# ---------------------------
@login_required
def checkout(request):
    # For demo: simply clear cart
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart.items.all().delete()
    return render(request, 'checkout_success.html')

# ---------------------------
# Search functionality
# ---------------------------
def search_products(request):
    query = request.GET.get('q', '').strip()
    results = []
    
    if query:
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )[:10]  # Limit to 10 results
        
        if request.GET.get('ajax'):
            # Return JSON for AJAX requests
            results = [
                {
                    'name': product.name,
                    'price': str(product.price),
                    'category': product.category.name
                }
                for product in products
            ]
            return JsonResponse({'results': results})
        else:
            # Regular search page
            return render(request, 'category_products.html', {
                'products': products,
                'category_name': f'Search results for "{query}"',
                'search_query': query
            })
    
    if request.GET.get('ajax'):
        return JsonResponse({'results': []})
    
    return render(request, 'category_products.html', {
        'products': [],
        'category_name': 'Search',
        'search_query': ''
    })

# ---------------------------
# Cart count for AJAX
# ---------------------------
@login_required
def cart_count(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    count = cart.items.aggregate(total=Sum('quantity'))['total'] or 0
    return JsonResponse({'count': count})
