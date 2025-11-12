/* eslint-disable */
var webMIConfig = {
  //The configuration parameters are described in the atvise help section "Client/Browserside scripting reference -> Configuration".
  "frame.enableautofit": false, // keep this false for better alignment of svg
  "frame.alignment": "top",
  "data.keepaliveinterval": 30000,
  "data.requesttimeout": 25000,
  // Configuration below is for JM Hansen Atvise frontend
  // For more info please contact: jorgen.antonsen@jmhansen.no
  nuxt: {
    alarms: {
      minPriority: 200,
      viewer: 'SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.alarming.list'	
    },
    home: {
      display: 'AGENT.DISPLAYS.Main',
      base: 'AGENT.OBJECTS.customers',
      frame: 'visu'
    },
    // types: {
    //   customer: 'ObjectTypes.PROJECT.AVJU.customer',
    //   location: 'ObjectTypes.PROJECT.AVJU.powerLine'
    // },
    defaultView: 'grid', // browser, grid or content(default atvise)
    defaultDark: true,
    // browserView: {
    //   // Object types to be browsed by the browserView
    //   types: [
    //     'ObjectTypes.PROJECT.jmhGeneral.area',
    //     'ObjectTypes.PROJECT.jmhEquipment',
    //     'VariableTypes.ATVISE.Display',
    //     61, //Folder
    //     //62
    //   ],
    //   subtype: false   
    // },
    // treeView: {
    //   // Object types to be browsed by the treeView
    //   types: [
    //     'ObjectTypes.PROJECT.jmhGeneral.area',
    //     // 'ObjectTypes.PROJECT.jmhEquipment',
    //     'VariableTypes.ATVISE.Display',
    //     61,
    //     // 62
    //   ],
    //   subtype: false
    // },
    navigationDrawer: {
      width: 300,
      color: 'primary',
      dark: true
    },
    appBar: {
      color: 'accent',
      dark: true
    }
  }
};