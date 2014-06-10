# => SRC FOLDER
toast 'src'
	# EXCLUDED FOLDERS (optional)
	# exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

	# => VENDORS (optional)
	# vendors: ['vendors/x.js', 'vendors/y.js', ... ]

	# => OPTIONS (optional, default values listed)
#	bare: false
#	packaging: true
#	expose: ''
        minify: false

        httpfolder: '/js/TowerAdventure/release'
        release: 'release/js/TowerAdventure.js'
        debug: 'release/js/TowerAdventure-debug.js'
