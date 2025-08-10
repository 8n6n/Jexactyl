<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameNestIdToPackIdInEggsTable extends Migration
{
    public function up()
    {
        Schema::table('eggs', function (Blueprint $table) {
            $table->renameColumn('nest_id', 'pack_id');
        });
    }

    public function down()
    {
        Schema::table('eggs', function (Blueprint $table) {
            $table->renameColumn('pack_id', 'nest_id');
        });
    }
}
