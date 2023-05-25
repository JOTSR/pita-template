#include <limits.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/sysinfo.h>
#include "main.h"

// Digital IOs
class DigitalPin
{
public:
    DigitalPin(std
               : string name)
    {
        value = CBooleanParameter(fmt::format("digital_{}", name), CBaseParameter::RW, false, 0);
        mode = CIntParameter(fmt::format("digital_{}#mode", name) CBaseParameter::RW, 0, 0, 0, 1);
        ²
    };
    CBooleanParameter value;
    CIntParameter mode;
}

static struct
{
    static DigitalPin led[8];
    static DigitalPin ioN[8];
    static DigitalPin ioP[8];
} digital;

for (int i = 0; i < 8; i++)
{
    digital.led[i] = DigitalPin(fmt::format("led_{}", i));
    digital.ioN[i] = DigitalPin(fmt::format("io_{}_n", i));
    digital.ioP[i] = DigitalPin(fmt::format("io_{}_p", i));
}

// Analog IOs
class AnalogPin
{
public:
    AnalogPin(std
              : string type, uint8_t pin)
    {
        value = CIntSignal(fmt::format("analog_{}_{}", type, pin), 1, -1);
        active = CBooleanParameter(fmt::format("analog_{}_{}#active", type, pin), CBaseParameter::RW, false, 0);
        bitness = CIntParameter(fmt::format("analog_{}_{}#active", type, pin), CBaseParameter::RW, 1, 0, 1, 12);
    };
    CIntSignal value;
    CBooleanParameter active;
    CIntParameter bitness;
}

static struct
{
    static AnalogPin out[] = {
        AnalogPin("out", 0),
        AnalogPin("out", 1),
        AnalogPin("out", 2)};
    static AnalogPin in[] = {
        AnalogPin("int", 0),
        AnalogPin("int", 1),
        AnalogPin("int", 2)}
} analog;

// Emitter
const char *rp_app_desc(void)
{
    return (const char *)"Template application.\n";
}

int rp_app_init(void)
{
    fprintf(stderr, "Loading LED control\n");
    CDataManager::GetInstance()->SetSignalInterval(100);
    CDataManager::GetInstance()->SetParamInterval(100);
    // Initialization of API
    if (rpApp_Init() != RP_OK)
    {
        fprintf(stderr, "Red Pitaya API init failed!\n");
        return EXIT_FAILURE;
    }
    else
        fprintf(stderr, "Red Pitaya API init success!\n");
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

// Listener
void UpdateSignals(void)
{
    // Analog IOs
    for (int i = 0; i < 4; i++)
    {
        if (analog.in[i].active.Value())
        {
            uint32_t value;
            rp_AIpinGetValueRaw(RP_AIN0 + i, &value);
            analog.in[i].value[0] = value;
        }
    }
}

void UpdateParams(void)
{
    // Digital IOs
    for (int i = 0; i < 8; i++)
    {
        // IO_Ns
        digital.ioN[i].mode.Update();
        if (digital.ioN[i].mode.Value() == 1)
        {
            rp_DpinSetDirection(RP_DIO0N + i, RP_IN);
            rp_pin_state state;
            rp_DpinGetState(RP_DIO0_N + i, &state);
            digital.ioN[i].value = (state == RP_HIGH);
        }
        // IO_Ps
        digital.ioP[i].mode.Update();
        if (digital.ioP[i].mode.Value() == 1)
        {
            rp_DpinSetDirection(RP_DIO0P + i, RP_IN);
            rp_pin_state state;
            rp_DpinGetState(RP_DIO0_P + i, &state);
            digital.ioP[i].value = (state == RP_HIGH);
        }
    }
}

void OnNewParams(void)
{
    // Digital IOs
    for (int i = 0; i < 8; i++)
    {
        // LEDs
        digital.led[i].value.Update();
        if (digital.led[i].value.Value())
            rp_DpinSetState(RP_LED0 + i, RP_HIGH);
        else
            rp_DpinSetState(RP_LED0 + i, RP_LOW);
        // IO_Ns
        digital.ioN[i].mode.Update();
        if (digital.ioN[i].mode.Value() == 0)
        {
            rp_DpinSetDirection(RP_DIO0N + i, RP_OUT);
            digital.ioN[i].value.Update();
            if (digital.ioN[i].value.Value())
                rp_DpinSetState(RP_DIO0_N + i, RP_HIGH);
            else
                rp_DpinSetState(RP_DIO0_N + i, RP_LOW);
        }
        // IO_Ps
        digital.ioP[i].mode.Update();
        if (digital.ioP[i].mode.Value() == 0)
        {
            rp_DpinSetDirection(RP_DIO0P + i, RP_OUT);
            digital.ioP[i].value.Update();
            if (digital.ioP[i].value.Value())
                rp_DpinSetState(RP_DIO0_P + i, RP_HIGH);
            else
                rp_DpinSetState(RP_DIO0_P + i, RP_LOW);
        }
    }
}

void OnNewSignals(void)
{
    // Analog IOs
    for (int i = 0; i < 4; i++)
    {
        analog.out[i].active.Update() if (analog.out[i].active.Value())
        {
            analog.out[i].value.Update();
            rp_AOpinSetValueRaw(RP_AOUT0 + i, analog.out[i].value.Value());
        }
    }
}

void PostUpdateSignals(void) {}