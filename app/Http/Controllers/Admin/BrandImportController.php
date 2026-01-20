<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class BrandImportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Brands/Import');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:10240'],
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        $headers = fgetcsv($handle);
        $errors = [];
        $imported = 0;
        $rowNumber = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;
            $data = array_combine($headers, $row);

            $validator = Validator::make($data, [
                'brand_name' => ['required', 'string', 'max:255'],
                'website_url' => ['required', 'url', 'max:500'],
                'category_primary' => ['required', 'string', 'max:100'],
                'category_secondary' => ['nullable', 'string', 'max:100'],
                'category_tertiary' => ['nullable', 'string', 'max:100'],
                'instagram_url' => ['nullable', 'url', 'max:500'],
                'tiktok_url' => ['nullable', 'url', 'max:500'],
                'description' => ['required', 'string'],
                'customer_age_min' => ['required', 'integer', 'min:18', 'max:100'],
                'customer_age_max' => ['required', 'integer', 'min:18', 'max:100', 'gte:customer_age_min'],
                'us_based' => ['required', 'in:0,1,true,false'],
            ]);

            if ($validator->fails()) {
                $errors[] = [
                    'row' => $rowNumber,
                    'errors' => $validator->errors()->all(),
                ];

                continue;
            }

            try {
                Brand::create([
                    'brand_name' => $data['brand_name'],
                    'website_url' => $data['website_url'],
                    'category_primary' => $data['category_primary'],
                    'category_secondary' => $data['category_secondary'] ?? null,
                    'category_tertiary' => $data['category_tertiary'] ?? null,
                    'instagram_url' => $data['instagram_url'] ?? null,
                    'tiktok_url' => $data['tiktok_url'] ?? null,
                    'description' => $data['description'],
                    'customer_age_min' => (int) $data['customer_age_min'],
                    'customer_age_max' => (int) $data['customer_age_max'],
                    'us_based' => in_array($data['us_based'], ['1', 'true'], true),
                ]);

                $imported++;
            } catch (\Exception $e) {
                $errors[] = [
                    'row' => $rowNumber,
                    'errors' => [$e->getMessage()],
                ];
            }
        }

        fclose($handle);

        if (count($errors) > 0) {
            return redirect()->back()->with([
                'success' => "{$imported} brands imported successfully.",
                'errors' => $errors,
            ]);
        }

        return redirect()->route('admin.brands.index')->with('success', "{$imported} brands imported successfully.");
    }
}
