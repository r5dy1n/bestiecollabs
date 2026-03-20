<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('social:sync --all')->daily();

Schedule::job(new \App\Jobs\TransitionHeldEarningsToAvailable)->daily();
Schedule::job(new \App\Jobs\ProcessCreatorPayouts)->cron('0 9 1 * *');
Schedule::job(new \App\Jobs\ProcessCreatorPayouts)->cron('0 9 15 * *');
Schedule::job(new \App\Jobs\ProcessMonthlyBrandBilling)->cron('0 8 1 * *');
