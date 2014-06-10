RELEASE = release/client.js
TOASTER = toaster


all	: clean release
	$(TOASTER) -c

watch	: clean
	$(TOASTER) -w

debug	: clean
	$(TOASTER) -wd


clean	: 
  echo "Running find . -delete : BEWARE !"
	find . -name "*~" -delete

.PHONY: clean all watch debug

