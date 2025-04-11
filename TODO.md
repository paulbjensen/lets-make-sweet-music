# TODO List

Nothing beats a little TODO list in Markdown.

## Timeline

- [ ] Add scrolling support for the timeline
- [ ] When the note is played, light it up in the timeline with some fancy CSS animation
- [ ] Add a time axis to the Timeline (seconds or bars/beats)

## Clock

- [ ] Add a clock component in the navigation bar that shows the time (both in seconds and in beats/bars)

## Track clips

- [ ] Be able to remove a note from a clip
- [ ] Be able to move a note in the clip
- [ ] Be able to change the note in the clip
- [ ] Be able to add a note in the clip

## Instruments

- [ ] Have other instruments that you can swap in/out for jamming

## Record own sounds

- [ ] I recorded my voice making silly sounds for a keyboard, but others may wish to record sounds and sample them.

## Recording

- [ ] Perhaps, capture jamming in a way so that if you produce something and wished you had recorded it, then it is there and you can simply pull it into a track. Yeah that would be nice

## Be able to save tracks and songs

Need to create a data hierarchy 

    Song 
    ⎿ Track
    ⎿ Track
       ⎿ Instrument
       ⎿ Clip
       ⎿ Clip
         ⎿ Note
         ⎿ Note

- A user has many songs
- A song has many tracks
- A track has one instrument
- A track has many clips
- A clip has many notes