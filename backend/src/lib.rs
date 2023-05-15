use libc::{c_char, c_int};
use std::ffi::CString;
use redpitaya::pin::digital::Pin;
use redpitaya::pin::State;
use redpitaya::pin;

// CBooleanParameter ledState("LED_STATE", CBaseParameter::RW, false, 0);

#[repr(C)]
pub struct RpAppParamsT {
    name: *mut char,
    value: f32,
    fpga_update: c_int,
    read_only: c_int,
    min_val: f32,
    max_val: f32,
}

//Emitter
#[no_mangle]
pub extern "C" fn rp_app_desc() -> *mut c_char {
    CString::new("Template application.\n").unwrap().into_raw()
}

#[no_mangle]
pub extern "C" fn rp_app_init() {
    eprintln!("Loading LED control");
    // Initialization of API
    redpitaya::init().expect("Red Pitaya API init failed!");
}

#[no_mangle]
pub extern "C" fn rp_app_exit() {
    eprintln!("Unloading LED control");
    redpitaya::release().expect("App not released");
}

#[no_mangle]
pub extern "C" fn rp_set_params(_params: *mut RpAppParamsT, _len: c_int) {}

#[no_mangle]
pub extern "C" fn rp_get_params(_params: *mut RpAppParamsT) {}

#[no_mangle]
pub extern "C" fn rp_get_signals(_signals: f32, _signals_num: *mut c_int, _signals_len: *mut c_int) {}

//Listener
#[no_mangle]
pub extern "C" fn UpdateSignals() {}

#[no_mangle]
pub extern "C" fn UpdateParams() {}

#[no_mangle]
pub extern "C" fn OnNewParams() {
    // ledState.Update();
    pin::digital::set_state(
        Pin::RP_LED0,
        // if ledState.Value() {
        if true {
            State::RP_HIGH
        } else {
            State::RP_LOW
        },
    ).unwrap()
}

#[no_mangle]
pub extern "C" fn OnNewSignals() {}

#[no_mangle]
pub extern "C" fn PostUpdateSignals() {}
