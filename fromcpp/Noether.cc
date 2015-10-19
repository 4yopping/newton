#include <nan.h>
#include <stdlib.h>
#include <cmath>
#include "../include/pcg_random.hpp"

void Random(const Nan::FunctionCallbackInfo<v8::Value>& info) {

  
		info.GetReturnValue().Set(Nan::New(random));
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
	v8::Local<v8::Object> obj = Nan::New<v8::Object>();
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(Random);
	  v8::Local<v8::Function> fn = tpl->GetFunction();
	obj->Set(Nan::New("random").ToLocalChecked(),fn);
		module->Set(Nan::New("exports").ToLocalChecked(),obj);
}

NODE_MODULE(Noether, Init)
