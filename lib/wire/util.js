var uuid = require('node-uuid')

var wire = require('./')

var wireutil = {
  global: '*ALL'
, log: '*LOG'
, makePrivateChannel: function() {
    return uuid.v4(null, new Buffer(16)).toString('base64')
  }
, toDeviceStatus: function(type) {
    return wire.DeviceStatus[{
      device: 'ONLINE'
    , emulator: 'ONLINE'
    , unauthorized: 'UNAUTHORIZED'
    , offline: 'OFFLINE'
    , absent: 'ABSENT'
    }[type]]
  }
, envelope: function(message) {
    return new wire.Envelope(message.$code, message.encode()).encodeNB()
  }
, makeDeviceLogMessage: function(serial, entry) {
    return wireutil.envelope(new wire.DeviceLogMessage(
      serial
    , entry.timestamp / 1000
    , entry.priority
    , entry.tag
    , entry.pid
    , entry.message
    , entry.identifier
    ))
  }
, makeGroupMessage: function(channel, timeout, requirements) {
    return wireutil.envelope(new wire.GroupMessage(
      channel
    , timeout
    , requirements
    ))
  }
, makeUngroupMessage: function(requirements) {
    return wireutil.envelope(new wire.UngroupMessage(
      requirements
    ))
  }
, makeJoinGroupMessage: function(serial) {
    return wireutil.envelope(new wire.JoinGroupMessage(
      serial
    ))
  }
, makeLeaveGroupMessage: function(serial) {
    return wireutil.envelope(new wire.LeaveGroupMessage(
      serial
    ))
  }
, makeDevicePokeMessage: function(serial, channel) {
    return wireutil.envelope(new wire.DevicePokeMessage(
      serial
    , channel
    ))
  }
, makeDeviceIdentityMessage: function(serial, identity) {
    return wireutil.envelope(new wire.DeviceIdentityMessage(
      serial
    , identity.platform
    , identity.manufacturer
    , identity.operator
    , identity.model
    , identity.version
    , identity.abi
    , identity.sdk
    , new wire.DeviceDisplayMessage(
        identity.display.id
      , identity.display.width
      , identity.display.height
      , identity.display.orientation
      , identity.display.xdpi
      , identity.display.ydpi
      , identity.display.fps
      , identity.display.density
      , identity.display.secure
      , identity.display.url
      )
    ))
  }
, makeDevicePropertiesMessage: function(serial, properties) {
    return wireutil.envelope(new wire.DevicePropertiesMessage(
      serial
    , Object.keys(properties).map(function(key) {
        return new wire.DeviceProperty(key, properties[key])
      })
    ))
  }
, makeDeviceStatusMessage: function(serial, type, provider) {
    return wireutil.envelope(new wire.DeviceStatusMessage(
      serial
    , wireutil.toDeviceStatus(type)
    , provider
    ))
  }
, makeProbeMessage: function() {
    return wireutil.envelope(new wire.ProbeMessage())
  }
, makeShellCommandMessage: function(channel, command) {
    return wireutil.envelope(new wire.ShellCommandMessage(
      channel
    , command
    ))
  }
, makeShellCommandDataMessage: function(serial, seq, chunk) {
    return wireutil.envelope(new wire.ShellCommandDataMessage(
      serial
    , seq
    , chunk
    ))
  }
, makeShellCommandDoneMessage: function(serial) {
    return wireutil.envelope(new wire.ShellCommandDoneMessage(
      serial
    ))
  }
, makeShellCommandFailMessage: function(serial, reason) {
    return wireutil.envelope(new wire.ShellCommandFailMessage(
      serial
    , reason
    ))
  }
}

module.exports = wireutil