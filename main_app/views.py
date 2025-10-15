from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import ProductForm
from .models import Product 

@login_required
def home(request):
    form = None
    if request.user.is_superuser:
        # إذا كان المستخدم Admin، جهز Form
        if request.method == 'POST':
            form = ProductForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return redirect('home')  # يعيد تحميل الصفحة
        else:
            form = ProductForm()
    
    # جلب كل المنتجات من قاعدة البيانات
    products = Product.objects.all()
    
    # تمرير المنتجات إلى القالب
    return render(request, 'index.html', {'form': form, 'products': products})

@login_required
def about(request):
    return render(request, 'about.html')

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
    
    return render(request, 'add_product.html', {'form': form})

def category_products(request, category_name):
    products = Product.objects.filter(category__name__iexact=category_name)
    return render(request, 'category_products.html', {
        'products': products,
        'category_name': category_name.capitalize()
    })

def category_products(request, category_name):
    # جلب المنتجات حسب الفئة
    products = Product.objects.filter(category__iexact=category_name)
    context = {
        'products': products,
        'category_name': category_name.title()  # Capitalize first letter
    }
    return render(request, 'category_products.html', context)
