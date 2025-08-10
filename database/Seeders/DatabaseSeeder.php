<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $this->call(PackSeeder::class);
        $this->call(EggSeeder::class);
        $this->call(WebhookSeeder::class);
    }
}
