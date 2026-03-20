<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::post('/stripe/webhook', [App\Http\Controllers\StripeWebhookController::class, 'handle'])->name('stripe.webhook');

Route::prefix('brands')->name('brands.')->group(function () {
    Route::get('/', [App\Http\Controllers\BrandDirectoryController::class, 'index'])->name('index');
    Route::get('/{brand}', [App\Http\Controllers\BrandDirectoryController::class, 'show'])->name('show');
});

Route::prefix('creators')->name('creators.')->group(function () {
    Route::get('/', [App\Http\Controllers\CreatorDirectoryController::class, 'index'])->name('index');
    Route::get('/{creator}', [App\Http\Controllers\CreatorDirectoryController::class, 'show'])->name('show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::post('shopify/connect', [App\Http\Controllers\ShopifyController::class, 'connect'])->name('shopify.connect');
    Route::get('shopify/callback', [App\Http\Controllers\ShopifyController::class, 'callback'])->name('shopify.callback');
    Route::delete('shopify/disconnect', [App\Http\Controllers\ShopifyController::class, 'disconnect'])->name('shopify.disconnect');
    Route::post('shopify/discounts', [App\Http\Controllers\ShopifyController::class, 'storeDiscount'])->name('shopify.discounts.store');
    Route::post('shopify/sync-orders', [App\Http\Controllers\ShopifyController::class, 'syncOrders'])->name('shopify.sync-orders');
    Route::post('shopify/sync-customers', [App\Http\Controllers\ShopifyController::class, 'syncCustomers'])->name('shopify.sync-customers');
    Route::get('shopify/analytics', [App\Http\Controllers\ShopifyController::class, 'getAnalytics'])->name('shopify.analytics');
    Route::get('shopify/demographics', [App\Http\Controllers\ShopifyController::class, 'getCustomerDemographics'])->name('shopify.demographics');
    Route::post('shopify/draft-orders', [App\Http\Controllers\ShopifyController::class, 'storeDraftOrder'])->name('shopify.draft-orders.store');
    Route::get('shopify/products', [App\Http\Controllers\ShopifyController::class, 'getProducts'])->name('shopify.products');

    Route::get('find-creators', [App\Http\Controllers\FindCreatorController::class, 'index'])->name('find-creators');
    Route::get('find-creators/{username}', [App\Http\Controllers\FindCreatorController::class, 'show'])
        ->name('find-creators.show');

    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [App\Http\Controllers\MessageController::class, 'index'])->name('index');
        Route::get('/{type}/{id}', [App\Http\Controllers\MessageController::class, 'show'])->name('show');
        Route::post('/', [App\Http\Controllers\MessageController::class, 'store'])->name('store');
    });

    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/', [App\Http\Controllers\PaymentController::class, 'index'])->name('index');
        Route::post('/setup-intent', [App\Http\Controllers\PaymentController::class, 'createSetupIntent'])->name('setup-intent');
        Route::post('/payment-method', [App\Http\Controllers\PaymentController::class, 'attachPaymentMethod'])->name('attach');
        Route::delete('/payment-method', [App\Http\Controllers\PaymentController::class, 'deletePaymentMethod'])->name('detach');
    });

    Route::prefix('payouts')->name('payouts.')->group(function () {
        Route::get('/', [App\Http\Controllers\PayoutController::class, 'index'])->name('index');
        Route::get('/onboard', [App\Http\Controllers\PayoutController::class, 'onboard'])->name('onboard');
        Route::get('/onboard/return', [App\Http\Controllers\PayoutController::class, 'onboardReturn'])->name('onboard.return');
        Route::get('/onboard/refresh', [App\Http\Controllers\PayoutController::class, 'onboardRefresh'])->name('onboard.refresh');
        Route::post('/instant', [App\Http\Controllers\PayoutController::class, 'requestInstant'])->name('instant');
    });
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('brands', App\Http\Controllers\Admin\BrandController::class);
    Route::get('brands-import', [App\Http\Controllers\Admin\BrandImportController::class, 'index'])->name('brands.import');
    Route::post('brands-import', [App\Http\Controllers\Admin\BrandImportController::class, 'store'])->name('brands.import.store');

    Route::resource('creators', App\Http\Controllers\Admin\CreatorController::class);
    Route::get('creators-import', [App\Http\Controllers\Admin\CreatorImportController::class, 'index'])->name('creators.import');
    Route::post('creators-import', [App\Http\Controllers\Admin\CreatorImportController::class, 'store'])->name('creators.import.store');

    Route::prefix('social-media')->name('social-media.')->group(function () {
        Route::get('/search', [App\Http\Controllers\Admin\SocialMediaSearchController::class, 'index'])->name('search');
        Route::post('/search', [App\Http\Controllers\Admin\SocialMediaSearchController::class, 'search'])->name('search.execute');
        Route::post('/import', [App\Http\Controllers\Admin\SocialMediaSearchController::class, 'import'])->name('import');
    });

    Route::prefix('creators/{creator}/social')->name('creators.social.')->group(function () {
        Route::post('/sync', [App\Http\Controllers\Admin\CreatorSocialSyncController::class, 'sync'])->name('sync');
        Route::post('/sync/{platform}', [App\Http\Controllers\Admin\CreatorSocialSyncController::class, 'syncPlatform'])->name('sync-platform');
    });

    Route::post('creators/bulk-sync', [App\Http\Controllers\Admin\CreatorSocialSyncController::class, 'bulkSync'])->name('creators.bulk-sync');

    Route::prefix('outreach')->name('outreach.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\OutreachController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\OutreachController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\OutreachController::class, 'store'])->name('store');
        Route::get('/{outreach}', [App\Http\Controllers\Admin\OutreachController::class, 'show'])->name('show');
        Route::patch('/{outreach}/status', [App\Http\Controllers\Admin\OutreachController::class, 'updateStatus'])->name('update-status');
    });

    Route::prefix('earnings')->name('earnings.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\CreatorEarningController::class, 'index'])->name('index');
        Route::post('/{earning}/approve', [App\Http\Controllers\Admin\CreatorEarningController::class, 'approve'])->name('approve');
        Route::post('/{earning}/reverse', [App\Http\Controllers\Admin\CreatorEarningController::class, 'reverse'])->name('reverse');
    });

    Route::get('payouts', [App\Http\Controllers\Admin\PayoutController::class, 'index'])->name('payouts.index');

    Route::prefix('invoices')->name('invoices.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\BrandInvoiceController::class, 'index'])->name('index');
        Route::get('/{invoice}', [App\Http\Controllers\Admin\BrandInvoiceController::class, 'show'])->name('show');
        Route::post('/{invoice}/charge', [App\Http\Controllers\Admin\BrandInvoiceController::class, 'charge'])->name('charge');
        Route::post('/{invoice}/void', [App\Http\Controllers\Admin\BrandInvoiceController::class, 'void'])->name('void');
    });

    Route::prefix('collaborations')->name('collaborations.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\CollaborationController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\CollaborationController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\CollaborationController::class, 'store'])->name('store');
        Route::get('/{collaboration}', [App\Http\Controllers\Admin\CollaborationController::class, 'show'])->name('show');
        Route::patch('/{collaboration}', [App\Http\Controllers\Admin\CollaborationController::class, 'update'])->name('update');
        Route::patch('/{collaboration}/status', [App\Http\Controllers\Admin\CollaborationController::class, 'updateStatus'])->name('update-status');
        Route::post('/{collaboration}/payment', [App\Http\Controllers\Admin\CollaborationController::class, 'addPayment'])->name('add-payment');
        Route::post('/{collaboration}/revenue', [App\Http\Controllers\Admin\CollaborationController::class, 'addRevenue'])->name('add-revenue');
        Route::patch('/{collaboration}/deliverables', [App\Http\Controllers\Admin\CollaborationController::class, 'updateDeliverables'])->name('update-deliverables');
    });
});

require __DIR__.'/settings.php';
