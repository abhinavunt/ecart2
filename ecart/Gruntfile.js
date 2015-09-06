module.exports = function(grunt){
	
	grunt.initConfig({
		
		uncss: {
			  dist: {
			    
			    files: {
			      'dist/css/tidy.css': ['public/views/indexNew.html']
			    }
			  }
			}
		
	});
	
	
	grunt.loadNpmTasks('grunt-uncss');

};