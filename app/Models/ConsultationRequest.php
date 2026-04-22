<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsultationRequest extends Model
{
    protected $fillable = [
        'id',
        'name',
        'email',
        'interest',
        'message',
    ];

    protected $keyType = 'string';

    public $incrementing = false;
}
