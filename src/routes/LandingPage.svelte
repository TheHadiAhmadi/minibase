<div class="flex items-center justify-end gap-4 p-6">
    <a class="py-1 px-2 rounded-lg outline-none" href="/login">Login</a>
    <a class="py-1 px-2 bg-blue-500 text-white rounded-lg outline-none" href="/signup">Signup</a>
</div>
<div class="container mx-auto">
	<div class="pt-10 sm:pt-20 md:pt-30 pb-20 gap-10 lg:px-20 w-full flex flex-col sm:flex-row items-center justify-between">
		<div class="pb-4 ">
			<h1 class="text-3xl text-gray-700">Welcome to <span class="font-bold text-4xl">the</span></h1>
			<h2 class="text-6xl text-blue-500 text-shadow font-bold">Minibase</h2>
			<h3 class="text-gray-400">Open Source HTTP based DataStore</h3>
            <div class="flex flex-row sm:flex-col sm:flex-row items-start gap-2 pt-4">
                <a class="px-4 py-0.75 md:py-1  <md:text-sm border border-blue-500 rounded-lg shadow bg-blue-500 text-white" href="/install">Get Started</a>
                <a class="px-4 py-0.75 md:py-1  <md:text-sm bg-gray-100 rounded-lg shadow" href="/docs">Learn More</a>
            </div>
		</div>
        <div class=" ">
		<pre
			class="<md:text-xs flex-1 mx-auto w-min font-bold bg-gray-700 text-gray-400 p-4 sm:p-8 rounded-lg shadow">{`import minibase from './minibase'

// Get data
const users = await minibase.get('users')

const newUser = {
    name: 'User',
    email: 'user@gmail.com'
}

// Add data
await minibase.insert('users', newUser)`}
</pre>
</div>

	</div>

	<div class="py-30 lg:px-20 flex flex-col sm:flex-row gap-10 items-center justify-between">
		<div class="flex-1">
			<span class="text-xl text-gray-700 font-bold">Create Rest API easily</span>
			<p class="text-gray-600 p-4">
				When you created a table,<br /> Minibase will create Full CRUD Rest API for you
			</p>
		</div>

		<pre class="text-[10px] line-spacing text-gray-300 bg-gray-700 rounded-lg shadow-2xl p-4">
* These Routes will be available ...
GET     https://[app].theminibase.com/[table].json 
POST    https://[app].theminibase.com/[table].json 
GET     https://[app].theminibase.com/[table]/[id].json 
PUT     https://[app].theminibase.com/[table]/[id].json 
DELETE  https://[app].theminibase.com/[table]/[id].json 
</pre>
	</div>


    <div class="py-30 lg:px-20 flex flex-col sm:flex-row gap-10 items-center justify-between">
		<div class="flex-1">
			<span class="text-xl text-gray-700 font-bold">Upload and Download Files</span>
			<p class="text-gray-600 p-4">
                You can upload files smaller than 2mb directly to minibase 
			</p>
		</div>

        <pre class="text-[10px] line-spacing text-gray-300 bg-gray-700 rounded-lg shadow-2xl p-4">

// Upload file
const file = await minibase.upload('./file.png')

// Download file
const downloaded = await minibase.download(file.id)
fs.writeFileSync('./file2.png', downloaded)
</pre>
	</div>

    


	<footer
		class="w-full p-4 flex flex-col gap-4 justify-center items-center "
	>
    <div class="flex gap-12">

    <a href="https://github.com/TheHadiAhmadi/minibase">Source Code</a>
    <a href="https://theminibase.com">Minibase</a>
</div>
<div>&copy; 2022 Hadi Ahmadi</div>
</footer>
</div>

<style>
	.text-shadow {
		text-shadow: 2px 2px #202020;
	}
	.line-spacing {
		line-height: 1rem;
	}
</style>
