<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'products' => Product::query()
                ->orderByDesc('created_at')
                ->get(['id', 'name', 'weight', 'description', 'price', 'image']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = trim((string) $request->input('name', ''));
        $weight = trim((string) $request->input('weight', ''));
        $description = trim((string) $request->input('description', ''));
        $price = trim((string) $request->input('price', ''));
        $image = trim((string) $request->input('image', ''));

        if ($name === '' || $description === '' || $price === '') {
            return response()->json(['error' => 'name, description, and price are required.'], 400);
        }

        $product = Product::create([
            'id' => (string) Str::uuid(),
            'name' => $name,
            'weight' => $weight,
            'description' => $description,
            'price' => $price,
            'image' => $image,
        ]);

        return response()->json([
            'product' => $product->only(['id', 'name', 'weight', 'description', 'price', 'image']),
        ], 201);
    }

    public function update(Request $request): JsonResponse
    {
        $id = trim((string) ($request->query('id') ?? $request->input('id', '')));

        if ($id === '') {
            return response()->json(['error' => 'id is required.'], 400);
        }

        $name = trim((string) $request->input('name', ''));
        $weight = trim((string) $request->input('weight', ''));
        $description = trim((string) $request->input('description', ''));
        $price = trim((string) $request->input('price', ''));
        $image = trim((string) $request->input('image', ''));

        if ($name === '' || $description === '' || $price === '') {
            return response()->json(['error' => 'name, description, and price are required.'], 400);
        }

        $product = Product::query()->find($id);

        if ($product === null) {
            return response()->json(['error' => 'Product not found.'], 404);
        }

        $product->update([
            'name' => $name,
            'weight' => $weight,
            'description' => $description,
            'price' => $price,
            'image' => $image,
        ]);

        return response()->json([
            'product' => $product->fresh()->only(['id', 'name', 'weight', 'description', 'price', 'image']),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $id = trim((string) $request->query('id', ''));

        if ($id === '') {
            return response()->json(['error' => 'id is required.'], 400);
        }

        $product = Product::query()->find($id);

        if ($product === null) {
            return response()->json(['error' => 'Product not found.'], 404);
        }

        $product->delete();

        return response()->json(['success' => true]);
    }
}
