module.exports = process.on('uncaughtException', err => {
	console.log('UNCAUGH EXCEPTION shuting Down.....');
	console.log(err.name, err.message);
		process.exit(1);
	
});

