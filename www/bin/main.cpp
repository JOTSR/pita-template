#include <limits.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/sysinfo.h>
#include "main.h"

//LEDs
CBooleanParameter led0State("LED_0_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led1State("LED_1_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led2State("LED_2_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led3State("LED_3_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led4State("LED_4_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led5State("LED_5_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led6State("LED_6_STATE", CBaseParameter::RW, false, 0);
CBooleanParameter led7State("LED_7_STATE", CBaseParameter::RW, false, 0);

//Slow inputs
#define SIGNAL_SIZE_DEFAULT 1
CFloatSignal ai0Value("AI_0", SIGNAL_SIZE_DEFAULT, 0.0f);
CBooleanParameter ai0Trigger("AI_0", CBaseParameter::RW, false, 0);

//Emitter
const char *rp_app_desc(void)
{
    return (const char *)"Template application.\n";
}

int rp_app_init(void)
{
    fprintf(stderr, "Loading LED control\n");
    CDataManager::GetInstance()->SetSignalInterval(10);
    // Initialization of API
    if (rpApp_Init() != RP_OK) 
    {
        fprintf(stderr, "Red Pitaya API init failed!\n");
        return EXIT_FAILURE;
    }
    else fprintf(stderr, "Red Pitaya API init success!\n");
    return 0;
}

int rp_app_exit(void)
{
    fprintf(stderr, "Unloading LED control\n");
    rpApp_Release();
    return 0;
}

int rp_set_params(rp_app_params_t *p, int len)
{
    return 0;
}

int rp_get_params(rp_app_params_t **p)
{
    return 0;
}

int rp_get_signals(float ***s, int *sig_num, int *sig_len)
{
    return 0;
}

//Listener
void UpdateSignals(void){
    if (ai0Trigger.Value()) {
        float val;
        rp_AIpinGetValue(0, &val);
        ai0Value[0] = val;
        // slowTrigger.Set(false);
    }
}

void UpdateParams(void){}

void OnNewParams(void) 
{
    //Slow
    ai0Trigger.Update();
    // if (ai0Trigger.Value()) {
    //     float val;
    //     rp_AIpinGetValue(0, &val);
    //     ai0Value[0] = val;
    //     // slowTrigger.Set(false);
    // }

    //Leds
    led0State.Update();
    if (led0State.Value() == false)
    {
        rp_DpinSetState(RP_LED0, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED0, RP_HIGH); 
    }

    led1State.Update();
    if (led1State.Value() == false)
    {
        rp_DpinSetState(RP_LED1, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED1, RP_HIGH); 
    }

    led2State.Update();
    if (led2State.Value() == false)
    {
        rp_DpinSetState(RP_LED2, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED2, RP_HIGH); 
    }

    led3State.Update();
    if (led3State.Value() == false)
    {
        rp_DpinSetState(RP_LED3, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED3, RP_HIGH); 
    }

    led4State.Update();
    if (led4State.Value() == false)
    {
        rp_DpinSetState(RP_LED4, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED4, RP_HIGH); 
    }

    led5State.Update();
    if (led5State.Value() == false)
    {
        rp_DpinSetState(RP_LED5, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED5, RP_HIGH); 
    }

    led6State.Update();
    if (led6State.Value() == false)
    {
        rp_DpinSetState(RP_LED6, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED6, RP_HIGH); 
    }

    led7State.Update();
    if (led7State.Value() == false)
    {
        rp_DpinSetState(RP_LED7, RP_LOW); 
    }
    else
    {
        rp_DpinSetState(RP_LED7, RP_HIGH); 
    }
}

void OnNewSignals(void){}

void PostUpdateSignals(void){}