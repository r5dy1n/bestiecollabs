<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::prefix('brands')->name('brands.')->group(function () {
    Route::get('/', [App\Http\Controllers\BrandDirectoryController::class, 'index'])->name('index');
    Route::get('/{brand}', [App\Http\Controllers\BrandDirectoryController::class, 'show'])->name('show');
});

Route::prefix('creators')->name('creators.')->group(function () {
    Route::get('/', [App\Http\Controllers\CreatorDirectoryController::class, 'index'])->name('index');
    Route::get('/{creator}', [App\Http\Controllers\CreatorDirectoryController::class, 'show'])->name('show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('find-creators', [App\Http\Controllers\FindCreatorController::class, 'index'])->name('find-creators');
    Route::post('find-creators/search', [App\Http\Controllers\FindCreatorController::class, 'search'])->name('find-creators.search');

    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [App\Http\Controllers\MessageController::class, 'index'])->name('index');
        Route::get('/{type}/{id}', [App\Http\Controllers\MessageController::class, 'show'])->name('show');
        Route::post('/', [App\Http\Controllers\MessageController::class, 'store'])->name('store');
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
