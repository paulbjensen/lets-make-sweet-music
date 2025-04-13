# TODO List

Nothing beats a little TODO list in Markdown.

## Timeline

- [ ] Add a time axis to the Timeline (seconds or bars/beats)
- [ ] Add scrolling support for the timeline
- [ ] When the note is played, light it up in the timeline with some fancy CSS animation

## Timer

- [ ] Add an option in the timer component to show beats/bars and BPM settings (time signature)

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

- [ ] Perhaps, capture jamming in a way so that if you produce something and wished you had recorded it, then it is there and you can simply pull it into a track. Yeah that would be nice.

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

## Stuff that is done

- [x] Disable the download button when recording is happening, and when no tracks exist
- [x] Be able to pass an array of events to attach to/detach from a single function
- [x] Add a clock component in the navigation bar that shows the time
- [x] Make the keyboard draggable
- [x] Handle cases where fetching a music file fails in the soundBox
