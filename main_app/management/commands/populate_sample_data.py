from django.core.management.base import BaseCommand
from main_app.models import Category, Product


class Command(BaseCommand):
    help = 'Populate the database with sample categories and products'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            ('Guitars', 'Electric & Acoustic Guitars'),
            ('Drums', 'Drum Sets & Percussion'),
            ('Pianos', 'Digital & Acoustic Pianos'),
            ('Strings', 'Violins, Cellos & More'),
            ('Amplifiers', 'Guitar & Bass Amps'),
        ]
        
        categories = {}
        for name, description in categories_data:
            category, created = Category.objects.get_or_create(name=name)
            categories[name] = category
            if created:
                self.stdout.write(f'Created category: {name}')
            else:
                self.stdout.write(f'Category already exists: {name}')

        # Create sample products
        products_data = [
            # Guitars
            ('Fender Stratocaster', 'Classic electric guitar with maple neck and rosewood fingerboard', 899.99, 'Guitars'),
            ('Gibson Les Paul', 'Premium electric guitar with mahogany body and maple top', 1299.99, 'Guitars'),
            ('Martin D-28', 'Professional acoustic guitar with solid spruce top', 2499.99, 'Guitars'),
            ('Taylor 814ce', 'Grand Auditorium acoustic-electric guitar', 2899.99, 'Guitars'),
            
            # Drums
            ('Pearl Vision Drum Set', 'Professional 5-piece drum kit with hardware', 799.99, 'Drums'),
            ('DW Performance Series', 'High-end drum set with maple shells', 1899.99, 'Drums'),
            ('Zildjian Cymbal Pack', 'Professional cymbal set with crashes and rides', 599.99, 'Drums'),
            
            # Pianos
            ('Yamaha P-125', '88-key weighted digital piano with speakers', 599.99, 'Pianos'),
            ('Casio Privia PX-160', 'Digital piano with realistic hammer action', 449.99, 'Pianos'),
            ('Steinway Model D', 'Concert grand piano (9 feet)', 89999.99, 'Pianos'),
            
            # Strings
            ('Stradivarius Violin', 'Professional violin with case and bow', 2499.99, 'Strings'),
            ('Yamaha Cello', 'Student cello with carbon fiber bow', 899.99, 'Strings'),
            ('Viola Starter Set', 'Complete viola package for beginners', 299.99, 'Strings'),
            
            # Amplifiers
            ('Marshall JCM800', '100W tube guitar amplifier head', 1499.99, 'Amplifiers'),
            ('Fender Twin Reverb', '85W tube amplifier with spring reverb', 1299.99, 'Amplifiers'),
            ('Orange Crush 20', '20W solid-state practice amplifier', 149.99, 'Amplifiers'),
        ]

        for name, description, price, category_name in products_data:
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'price': price,
                    'category': categories[category_name]
                }
            )
            if created:
                self.stdout.write(f'Created product: {name}')
            else:
                self.stdout.write(f'Product already exists: {name}')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data!')
        )
