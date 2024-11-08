# Controller example to commission and connect to an Arduino Nano Matter device

This example shows how a controller can be implemented by pairing and connecting to a paired device. The device used in this example is an **Arduino Nano Matter** board running the **[matter_on_off_outlet sketch](https://github.com/SiliconLabs/arduino/tree/main/libraries/Matter/examples/matter_on_off_outlet)**. When the On/Off Endpoint with **ID 3** is detected, it can be controlled and toggled.


## Usage

For general documentation about the CLI parameters or environment variables that can be used for matter.js please refer to the [Examples README](../../../README.md#cli-usage).

The current controller implementation is no CLI tool, but shows the pairing of devices and resuming the connection and also showcase the existing low-level controller API. It is just intended to be used for debugging, during development! The code contains some commented-out examples of how to use the low level controller API.
Please **do not** use this for production, we will replace the API soon!

The controller currently is not discovering the device to pair, but directly connects to the IP/port defined bin the command line parameters.

To run from the build files:

```bash
matter-controller-arduino
```

To run directly from Typescript files with on the fly compilation:

```bash
npm run matter-controller-arduino
```

To start the commissioning and communication with the Arduino Matter device, run the following command with the necessary parameters:

```bash
npm run matter-controller-arduino -- --ble --ble-thread-networkname=<THREAD_NETWORK_NAME> --ble-thread-operationaldataset=<OPERATIONAL_DATASET> --pairingcode=<PAIRING_CODE>
```

Where you should replace the following placeholders:

- `<THREAD_NETWORK_NAME>`: the name of the Thread network.
- `<THREAD_OPERATIONAL_DATASET>`: the operational dataset (in hexadecimal format).
- `<PAIRING_CODE>`: the pairing code, which can be found in the serial output of the Arduino Nano Matter device.

The commissioning process happens over Bluetooth to join a Thread network managed by an OTBR.
If the device has already joined a network and you want to start from scratch, you can run the command with the `--storage-clear` parameter

## Parameters description

This will commission a MatterServer device (for debugging/capability showing purpose only for now).

The following parameters are available and used to initially commission a device (they can be omitted after this):
* If the IP and Port of the device is known (should be only the case in testing cases) you can use the following parameters:
    * --ip: the IP address of the device to commission (can be used but discovery via pairingcode or discriminator or also just pin (passode) is most likely better)
    * --port the port of the device to commission (default: 5540)
* Device identification options:
    * --pairingcode: code to use for pairing (-longDiscriminator and -pin will be ignored) - usually the code below the QR Code on the device or displayed in the app!
    * --longDiscriminator: the discriminator to use for pairing (default: 3840, value between 0 and 4095)
    * --pin: the pin to use for pairing (default: 20202021)
* When the device to commission is not already in the IP network and also not an Ethernet device commission can be done via ble. In this case the following parameters are used:
    * --ble: enable BLE support (default: false) If this is enabled the controller will try to connect via BLE first (15s timeout) and then via IP if not commissioned yet!
    * --ble-hci-id: Optionally, HCI ID to use (Linux only, default 0)
    * --ble-wifi-ssid: SSID/Name of the Wifi network to connect to - The device will scan especially for this network and commissioning will fail if not found
    * --ble-wifi-credentials: Credentials for the Wifi network to connect to
    * --ble-thread-networkname: Name of the Thread network to connect to - The device will verify that a thread network with this name is reachable by the device and commissioning will fail if not found
    * --ble-thread-operationaldataset: Operational dataset as hex string to use for commissioning (of using OTBR use `ot-ctl dataset active -x` to get the value)
