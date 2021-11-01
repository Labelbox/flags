IMAGE_NAME := flags
LOCAL_IMAGE := ${IMAGE_NAME}:latest

build-image:
	docker build \
	-t ${LOCAL_IMAGE} \
	-f ./Dockerfile \
	.
