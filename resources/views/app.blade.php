<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="AudioWerkhaus custom listening systems and consultation.">
        <title>AudioWerkhaus</title>
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @viteReactRefresh
            @vite(['src/index.css', 'src/main.tsx'])
        @endif
    </head>
    <body class="bg-black text-white antialiased">
        <div id="root"></div>
    </body>
</html>
