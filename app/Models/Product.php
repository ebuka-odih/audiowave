<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'id',
        'name',
        'weight',
        'description',
        'price',
        'image',
    ];

    protected $keyType = 'string';

    public $incrementing = false;
}
