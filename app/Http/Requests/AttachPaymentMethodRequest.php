<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttachPaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isBrand() ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'payment_method_id' => ['required', 'string', 'starts_with:pm_'],
        ];
    }
}
