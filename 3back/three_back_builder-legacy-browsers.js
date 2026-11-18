/*************************** 
 * Three_Back_Builder *
 ***************************/


// store info about the experiment session:
let expName = 'Three_Back_Builder';  // from the Builder filename that created this script
let expInfo = {
    'student_id': '',
    'gender': ['', '남성', '여성', '기타', '응답 안 함'],
    'nationality': '',
    'age': '',
    'education': ['', '고등학교 졸업', '대학교 재학', '대학교 졸업', '대학원 졸업'],
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

// Start code blocks for 'Before Experiment'
var measuredFrameRate;
var frameRateHz;
var requestedRefresh;
var timingSource;
var timingHz;
var fixationFrames;
var stimulusFrames;
var responseFrames;
var stimulusStartFrame;
var nbackSessionId = "";
var nbackRows = [];
var nbackUploadAttempted = false;
var nbackUploadResult = null;
const NBACK_TASK_NAME = "3back";
const NBACK_LEVEL = 3;
const NBACK_FIXATION_MS = 500;
const NBACK_STIMULUS_MS = 300;
const NBACK_RESPONSE_WINDOW_MS = 1800;
const NBACK_CSV_COLUMNS = [
  "session_id",
  "task_name",
  "n_level",
  "blockType",
  "blockLabel",
  "blockOrderIndex",
  "trialNumber",
  "scoredTrialIndex",
  "relationType",
  "relationLabel",
  "stimulus",
  "stimulusRole",
  "combination",
  "position",
  "isDummy",
  "isTarget",
  "expectedResponse",
  "coranswer",
  "condition",
  "Attribute1",
  "status",
  "response_key",
  "response_rt_s",
  "response_rt_ms",
  "response_made",
  "response_correct",
  "measured_frame_rate_hz",
  "timing_frame_rate_hz",
  "timing_hz",
  "timing_source",
  "requested_refresh_rate_hz",
  "fixation_ms",
  "stimulus_ms",
  "response_window_ms"
];


function nbackSafeValue(value) {
  if (typeof value === "undefined" || value === null) {
    return "";
  }
  return value;
}


function nbackAsString(value) {
  return String(nbackSafeValue(value));
}


function nbackAsInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}


function nbackMakeSessionId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "session-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}


function nbackCsvEscape(value) {
  const text = nbackAsString(value);
  if (/[",\r\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}


function nbackRowsToCsv(rows) {
  const header = NBACK_CSV_COLUMNS.join(",");
  const lines = rows.map((row) => NBACK_CSV_COLUMNS.map((column) => nbackCsvEscape(row[column])).join(","));
  return [header].concat(lines).join("\r\n");
}


function nbackCsvFilename() {
  const studentId = nbackAsString(expInfo["student_id"] || "participant").replace(/[^A-Za-z0-9_-]+/g, "_");
  return NBACK_TASK_NAME + "_" + studentId + "_" + nbackSessionId + ".csv";
}


function nbackDownloadCsv() {
  const csvText = nbackRowsToCsv(nbackRows);
  const blob = new Blob(["\ufeff", csvText], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nbackCsvFilename();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}


function nbackMetadata(isCompleted) {
  return {
    session_id: nbackSessionId,
    task_name: NBACK_TASK_NAME,
    n_level: NBACK_LEVEL,
    completed: isCompleted,
    student_id: nbackAsString(expInfo["student_id"]),
    gender: nbackAsString(expInfo["gender"]),
    nationality: nbackAsString(expInfo["nationality"]),
    age: nbackAsString(expInfo["age"]),
    education: nbackAsString(expInfo["education"]),
    session_label: nbackAsString(expInfo["session_label"]),
    requested_refresh_rate_hz: nbackAsString(expInfo["refresh_rate"]),
    measured_frame_rate_hz: nbackSafeValue(expInfo["measuredFrameRate"]),
    timing_frame_rate_hz: nbackSafeValue(expInfo["timingFrameRate"]),
    timing_hz: nbackSafeValue(expInfo["timingHz"]),
    timing_source: nbackAsString(expInfo["timingSource"]),
    response_window_ms: NBACK_RESPONSE_WINDOW_MS,
    user_agent: window.navigator.userAgent,
    platform: window.navigator.platform,
    language: window.navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    url: window.location.href,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      avail_width: window.screen.availWidth,
      avail_height: window.screen.availHeight,
      device_pixel_ratio: window.devicePixelRatio
    }
  };
}


function nbackBuildPayload(isCompleted) {
  return {
    session_id: nbackSessionId,
    task_name: NBACK_TASK_NAME,
    n_level: NBACK_LEVEL,
    completed: isCompleted,
    metadata: nbackMetadata(isCompleted),
    trials: nbackRows,
    csv_text: nbackRowsToCsv(nbackRows)
  };
}


var nbackUploadAttempted;
async function nbackSubmitResults(isCompleted) {
  if (nbackUploadAttempted) {
    return nbackUploadResult || { ok: false, status: 0, error: "already attempted" };
  }
  nbackUploadAttempted = true;
  try {
    const response = await fetch("/api/nback/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nbackBuildPayload(isCompleted))
    });
    let body = {};
    try {
      body = await response.json();
    } catch (error) {
      body = {};
    }
    nbackUploadResult = { ok: response.ok, status: response.status, body: body };
  } catch (error) {
    nbackUploadResult = { ok: false, status: 0, error: String(error) };
  }
  return nbackUploadResult;
}

// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([0,0,0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});
// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); },flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(introRoutineBegin());
flowScheduler.add(introRoutineEachFrame());
flowScheduler.add(introRoutineEnd());
flowScheduler.add(practice_startRoutineBegin());
flowScheduler.add(practice_startRoutineEachFrame());
flowScheduler.add(practice_startRoutineEnd());
const practice_trialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(practice_trialsLoopBegin(practice_trialsLoopScheduler));
flowScheduler.add(practice_trialsLoopScheduler);
flowScheduler.add(practice_trialsLoopEnd);


flowScheduler.add(main_startRoutineBegin());
flowScheduler.add(main_startRoutineEachFrame());
flowScheduler.add(main_startRoutineEnd());
const trialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopBegin(trialsLoopScheduler));
flowScheduler.add(trialsLoopScheduler);
flowScheduler.add(trialsLoopEnd);



flowScheduler.add(endRoutineBegin());
flowScheduler.add(endRoutineEachFrame());
flowScheduler.add(endRoutineEnd());
flowScheduler.add(quitPsychoJS, 'Thank you for your patience.', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, 'Thank you for your patience.', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    // resources:
    {'name': 'conditions/practice.csv', 'path': 'conditions/practice.csv?v=20261021-userlist'},
    {'name': 'conditions/main.csv', 'path': 'conditions/main.csv?v=20261021-userlist'},
    {'name': 'conditions/practice.csv', 'path': 'conditions/practice.csv?v=20261021-userlist'},
    {'name': 'conditions/main.csv', 'path': 'conditions/main.csv?v=20261021-userlist'},
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.INFO);


var currentLoop;
var frameDur;
async function updateInfo() {
  currentLoop = psychoJS.experiment;  // right now there are no loops
  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';
  expInfo['OS'] = window.navigator.platform;


  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  

  
  psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["student_id"]}_${expName}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = '\t';


  return Scheduler.Event.NEXT;
}


var introClock;
var intro_text;
var intro_key;
var measuredFrameRate;
var frameRateHz;
var requestedRefresh;
var timingSource;
var timingHz;
var fixationFrames;
var stimulusFrames;
var responseFrames;
var stimulusStartFrame;
var nbackSessionId;
var nbackRows;
var nbackUploadResult;
var practice_startClock;
var practice_start_text;
var practice_start_key;
var trialClock;
var fixation;
var stimulus_text;
var trial_resp;
var main_startClock;
var main_start_text;
var main_start_key;
var break_screenClock;
var break_screen_text;
var break_screen_key;
var endClock;
var end_text;
var end_key;
var globalClock;
var routineTimer;
async function experimentInit() {
  // Initialize components for Routine "intro"
  introClock = new util.Clock();
  intro_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'intro_text',
    text: '3-back 실험\n\n검정 화면 중앙에 +가 먼저 나오고, 이어서 흰색 음절이 제시됩니다.\n현재 음절이 3개 전 음절과 같으면 Space를 누르세요.\n\nSpace로 시작',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.035,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  intro_key = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Run 'Begin Experiment' code from timing_code
  measuredFrameRate = expInfo['frameRate'];
  frameRateHz = measuredFrameRate;
  requestedRefresh = expInfo['refresh_rate'] || 'auto';
  timingSource = 'auto';
  
  if (requestedRefresh !== '' && requestedRefresh !== null && requestedRefresh !== 'auto') {
    const parsedRefresh = Number.parseFloat(requestedRefresh);
    if (Number.isFinite(parsedRefresh)) {
      frameRateHz = parsedRefresh;
      timingSource = 'manual';
    } else {
      frameRateHz = expInfo['frameRate'];
    }
  }
  
  if (!Number.isFinite(frameRateHz)) {
    frameRateHz = 60.0;
    timingSource = 'fallback_60';
  }
  
  timingHz = Math.max(1, Math.round(frameRateHz));
  fixationFrames = Math.max(1, Math.round(0.500 * timingHz));
  stimulusFrames = Math.max(1, Math.round(0.300 * timingHz));
  responseFrames = Math.max(1, Math.round(1.800 * timingHz));
  stimulusStartFrame = fixationFrames;
  nbackSessionId = nbackMakeSessionId();
  nbackRows = [];
  nbackUploadAttempted = false;
  nbackUploadResult = null;
  
  expInfo['session_id'] = nbackSessionId;
  expInfo['taskName'] = NBACK_TASK_NAME;
  expInfo['nLevel'] = NBACK_LEVEL;
  expInfo['timingHz'] = timingHz;
  expInfo['measuredFrameRate'] = measuredFrameRate;
  expInfo['timingFrameRate'] = frameRateHz;
  expInfo['timingSource'] = timingSource;
  expInfo['responseWindowMs'] = NBACK_RESPONSE_WINDOW_MS;
  
  // Initialize components for Routine "practice_start"
  practice_startClock = new util.Clock();
  practice_start_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'practice_start_text',
    text: '연습을 시작합니다.\n\nSpace를 누르면 시작합니다.',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.035,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  practice_start_key = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "trial"
  trialClock = new util.Clock();
  fixation = new visual.TextStim({
    win: psychoJS.window,
    name: 'fixation',
    text: '+',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.08,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  stimulus_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'stimulus_text',
    text: '',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.09,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  trial_resp = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "main_start"
  main_startClock = new util.Clock();
  main_start_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'main_start_text',
    text: '본실험을 시작합니다.\n\nSpace를 누르면 시작합니다.',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.035,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  main_start_key = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "break_screen"
  break_screenClock = new util.Clock();
  break_screen_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'break_screen_text',
    text: '휴식 시간입니다.\n\n잠시 쉬었다가 준비되면 Space를 누르세요.',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.035,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  break_screen_key = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "end"
  endClock = new util.Clock();
  end_text = new visual.TextStim({
    win: psychoJS.window,
    name: 'end_text',
    text: '실험이 끝났습니다.\n\nSpace를 누르면 종료합니다.',
    font: 'Apple SD Gothic Neo',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.035,  wrapWidth: 1.4, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  end_key = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  return Scheduler.Event.NEXT;
}


var t;
var frameN;
var continueRoutine;
var routineForceEnded;
var introMaxDurationReached;
var _intro_key_allKeys;
var introMaxDuration;
var introComponents;
function introRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'intro' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    introClock.reset();
    routineTimer.reset();
    introMaxDurationReached = false;
    // update component parameters for each repeat
    intro_key.keys = undefined;
    intro_key.rt = undefined;
    _intro_key_allKeys = [];
    psychoJS.experiment.addData('intro.started', globalClock.getTime());
    introMaxDuration = null
    // keep track of which components have finished
    introComponents = [];
    introComponents.push(intro_text);
    introComponents.push(intro_key);
    
    introComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
    return Scheduler.Event.NEXT;
  }
}


function introRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'intro' ---
    // get current time
    t = introClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *intro_text* updates
    if (t >= 0.0 && intro_text.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      intro_text.tStart = t;  // (not accounting for frame time here)
      intro_text.frameNStart = frameN;  // exact frame index
      
      intro_text.setAutoDraw(true);
    }
    
    
    // if intro_text is active this frame...
    if (intro_text.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *intro_key* updates
    if (t >= 0.2 && intro_key.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      intro_key.tStart = t;  // (not accounting for frame time here)
      intro_key.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { intro_key.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { intro_key.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { intro_key.clearEvents(); });
    }
    
    // if intro_key is active this frame...
    if (intro_key.status === PsychoJS.Status.STARTED) {
      let theseKeys = intro_key.getKeys({keyList: 'space', waitRelease: false});
      _intro_key_allKeys = _intro_key_allKeys.concat(theseKeys);
      if (_intro_key_allKeys.length > 0) {
        intro_key.keys = _intro_key_allKeys[_intro_key_allKeys.length - 1].name;  // just the last key pressed
        intro_key.rt = _intro_key_allKeys[_intro_key_allKeys.length - 1].rt;
        intro_key.duration = _intro_key_allKeys[_intro_key_allKeys.length - 1].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    introComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function introRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'intro' ---
    introComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
    psychoJS.experiment.addData('intro.stopped', globalClock.getTime());
    // update the trial handler
    if (currentLoop instanceof MultiStairHandler) {
      currentLoop.addResponse(intro_key.corr, level);
    }
    psychoJS.experiment.addData('intro_key.keys', intro_key.keys);
    if (typeof intro_key.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('intro_key.rt', intro_key.rt);
        psychoJS.experiment.addData('intro_key.duration', intro_key.duration);
        routineTimer.reset();
        }
    
    intro_key.stop();
    // the Routine "intro" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var practice_startMaxDurationReached;
var _practice_start_key_allKeys;
var practice_startMaxDuration;
var practice_startComponents;
function practice_startRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'practice_start' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    practice_startClock.reset();
    routineTimer.reset();
    practice_startMaxDurationReached = false;
    // update component parameters for each repeat
    practice_start_key.keys = undefined;
    practice_start_key.rt = undefined;
    _practice_start_key_allKeys = [];
    psychoJS.experiment.addData('practice_start.started', globalClock.getTime());
    practice_startMaxDuration = null
    // keep track of which components have finished
    practice_startComponents = [];
    practice_startComponents.push(practice_start_text);
    practice_startComponents.push(practice_start_key);
    
    practice_startComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
    return Scheduler.Event.NEXT;
  }
}


function practice_startRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'practice_start' ---
    // get current time
    t = practice_startClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *practice_start_text* updates
    if (t >= 0.0 && practice_start_text.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      practice_start_text.tStart = t;  // (not accounting for frame time here)
      practice_start_text.frameNStart = frameN;  // exact frame index
      
      practice_start_text.setAutoDraw(true);
    }
    
    
    // if practice_start_text is active this frame...
    if (practice_start_text.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *practice_start_key* updates
    if (t >= 0.2 && practice_start_key.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      practice_start_key.tStart = t;  // (not accounting for frame time here)
      practice_start_key.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { practice_start_key.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { practice_start_key.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { practice_start_key.clearEvents(); });
    }
    
    // if practice_start_key is active this frame...
    if (practice_start_key.status === PsychoJS.Status.STARTED) {
      let theseKeys = practice_start_key.getKeys({keyList: 'space', waitRelease: false});
      _practice_start_key_allKeys = _practice_start_key_allKeys.concat(theseKeys);
      if (_practice_start_key_allKeys.length > 0) {
        practice_start_key.keys = _practice_start_key_allKeys[_practice_start_key_allKeys.length - 1].name;  // just the last key pressed
        practice_start_key.rt = _practice_start_key_allKeys[_practice_start_key_allKeys.length - 1].rt;
        practice_start_key.duration = _practice_start_key_allKeys[_practice_start_key_allKeys.length - 1].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    practice_startComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function practice_startRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'practice_start' ---
    practice_startComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
    psychoJS.experiment.addData('practice_start.stopped', globalClock.getTime());
    // update the trial handler
    if (currentLoop instanceof MultiStairHandler) {
      currentLoop.addResponse(practice_start_key.corr, level);
    }
    psychoJS.experiment.addData('practice_start_key.keys', practice_start_key.keys);
    if (typeof practice_start_key.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('practice_start_key.rt', practice_start_key.rt);
        psychoJS.experiment.addData('practice_start_key.duration', practice_start_key.duration);
        routineTimer.reset();
        }
    
    practice_start_key.stop();
    // the Routine "practice_start" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var practice_trials;
function practice_trialsLoopBegin(practice_trialsLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // set up handler to look after randomisation of conditions etc
    practice_trials = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
      extraInfo: expInfo, originPath: undefined,
      trialList: 'conditions/practice.csv',
      seed: undefined, name: 'practice_trials'
    });
    psychoJS.experiment.addLoop(practice_trials); // add the loop to the experiment
    currentLoop = practice_trials;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    practice_trials.forEach(function() {
      snapshot = practice_trials.getSnapshot();
    
      practice_trialsLoopScheduler.add(importConditions(snapshot));
      practice_trialsLoopScheduler.add(trialRoutineBegin(snapshot));
      practice_trialsLoopScheduler.add(trialRoutineEachFrame());
      practice_trialsLoopScheduler.add(trialRoutineEnd(snapshot));
      practice_trialsLoopScheduler.add(practice_trialsLoopEndIteration(practice_trialsLoopScheduler, snapshot));
    });
    
    return Scheduler.Event.NEXT;
  }
}


async function practice_trialsLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(practice_trials);
  // update the current loop from the ExperimentHandler
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;  // so we use addData from the experiment
  return Scheduler.Event.NEXT;
}


function practice_trialsLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    return Scheduler.Event.NEXT;
    }
  };
}


var trials;
function trialsLoopBegin(trialsLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // set up handler to look after randomisation of conditions etc
    trials = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
      extraInfo: expInfo, originPath: undefined,
      trialList: 'conditions/main.csv',
      seed: undefined, name: 'trials'
    });
    psychoJS.experiment.addLoop(trials); // add the loop to the experiment
    currentLoop = trials;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    trials.forEach(function() {
      snapshot = trials.getSnapshot();
    
      trialsLoopScheduler.add(importConditions(snapshot));
      trialsLoopScheduler.add(trialRoutineBegin(snapshot));
      trialsLoopScheduler.add(trialRoutineEachFrame());
      trialsLoopScheduler.add(trialRoutineEnd(snapshot));
      trialsLoopScheduler.add(break_screenRoutineBegin(snapshot));
      trialsLoopScheduler.add(break_screenRoutineEachFrame());
      trialsLoopScheduler.add(break_screenRoutineEnd(snapshot));
      trialsLoopScheduler.add(trialsLoopEndIteration(trialsLoopScheduler, snapshot));
    });
    
    return Scheduler.Event.NEXT;
  }
}


async function trialsLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(trials);
  // update the current loop from the ExperimentHandler
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;  // so we use addData from the experiment
  return Scheduler.Event.NEXT;
}


function trialsLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    return Scheduler.Event.NEXT;
    }
  };
}


var trialMaxDurationReached;
var _trial_resp_allKeys;
var trialMaxDuration;
var trialComponents;
function trialRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'trial' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    trialClock.reset();
    routineTimer.reset();
    trialMaxDurationReached = false;
    // update component parameters for each repeat
    stimulus_text.setText(stimulus);
    trial_resp.keys = undefined;
    trial_resp.rt = undefined;
    _trial_resp_allKeys = [];
    psychoJS.experiment.addData('trial.started', globalClock.getTime());
    trialMaxDuration = null
    // keep track of which components have finished
    trialComponents = [];
    trialComponents.push(fixation);
    trialComponents.push(stimulus_text);
    trialComponents.push(trial_resp);
    
    trialComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
    return Scheduler.Event.NEXT;
  }
}


function trialRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'trial' ---
    // get current time
    t = trialClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *fixation* updates
    if (frameN >= 0 && fixation.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      fixation.tStart = t;  // (not accounting for frame time here)
      fixation.frameNStart = frameN;  // exact frame index
      
      fixation.setAutoDraw(true);
    }
    
    
    // if fixation is active this frame...
    if (fixation.status === PsychoJS.Status.STARTED) {
    }
    
    if (fixation.status === PsychoJS.Status.STARTED && frameN >= (fixation.frameNStart + fixationFrames)) {
      // keep track of stop time/frame for later
      fixation.tStop = t;  // not accounting for scr refresh
      fixation.frameNStop = frameN;  // exact frame index
      // update status
      fixation.status = PsychoJS.Status.FINISHED;
      fixation.setAutoDraw(false);
    }
    
    
    // *stimulus_text* updates
    if (frameN >= stimulusStartFrame && stimulus_text.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      stimulus_text.tStart = t;  // (not accounting for frame time here)
      stimulus_text.frameNStart = frameN;  // exact frame index
      
      stimulus_text.setAutoDraw(true);
    }
    
    
    // if stimulus_text is active this frame...
    if (stimulus_text.status === PsychoJS.Status.STARTED) {
    }
    
    if (stimulus_text.status === PsychoJS.Status.STARTED && frameN >= (stimulus_text.frameNStart + stimulusFrames)) {
      // keep track of stop time/frame for later
      stimulus_text.tStop = t;  // not accounting for scr refresh
      stimulus_text.frameNStop = frameN;  // exact frame index
      // update status
      stimulus_text.status = PsychoJS.Status.FINISHED;
      stimulus_text.setAutoDraw(false);
    }
    
    
    // *trial_resp* updates
    if (frameN >= stimulusStartFrame && trial_resp.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      trial_resp.tStart = t;  // (not accounting for frame time here)
      trial_resp.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { trial_resp.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { trial_resp.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { trial_resp.clearEvents(); });
    }
    if (trial_resp.status === PsychoJS.Status.STARTED && frameN >= (trial_resp.frameNStart + responseFrames)) {
      // keep track of stop time/frame for later
      trial_resp.tStop = t;  // not accounting for scr refresh
      trial_resp.frameNStop = frameN;  // exact frame index
      // update status
      trial_resp.status = PsychoJS.Status.FINISHED;
      if (trial_resp.status === PsychoJS.Status.STARTED && frameN >= (trial_resp.frameNStart + responseFrames)) {
        // keep track of stop time/frame for later
        trial_resp.tStop = t;  // not accounting for scr refresh
        trial_resp.frameNStop = frameN;  // exact frame index
        // update status
        trial_resp.status = PsychoJS.Status.FINISHED;
        trial_resp.status = PsychoJS.Status.FINISHED;
          }
        
      }
      
      // if trial_resp is active this frame...
      if (trial_resp.status === PsychoJS.Status.STARTED) {
        let theseKeys = trial_resp.getKeys({keyList: 'space', waitRelease: false});
        _trial_resp_allKeys = _trial_resp_allKeys.concat(theseKeys);
        if (_trial_resp_allKeys.length > 0) {
          trial_resp.keys = _trial_resp_allKeys[_trial_resp_allKeys.length - 1].name;  // just the last key pressed
          trial_resp.rt = _trial_resp_allKeys[_trial_resp_allKeys.length - 1].rt;
          trial_resp.duration = _trial_resp_allKeys[_trial_resp_allKeys.length - 1].duration;
        }
      }
      
      // check for quit (typically the Esc key)
      if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
        return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
      }
      
      // check if the Routine should terminate
      if (!continueRoutine) {  // a component has requested a forced-end of Routine
        routineForceEnded = true;
        return Scheduler.Event.NEXT;
      }
      
      continueRoutine = false;  // reverts to True if at least one component still running
      trialComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
          continueRoutine = true;
        }
      });
      
      // refresh the screen if continuing
      if (continueRoutine) {
        return Scheduler.Event.FLIP_REPEAT;
      } else {
        return Scheduler.Event.NEXT;
      }
    };
  }
  
  
var response_key;
var response_made;
var response_rt_s;
var response_rt_ms;
var response_correct;
function trialRoutineEnd(snapshot) {
    return async function () {
      //--- Ending Routine 'trial' ---
      trialComponents.forEach( function(thisComponent) {
        if (typeof thisComponent.setAutoDraw === 'function') {
          thisComponent.setAutoDraw(false);
        }
      });
      psychoJS.experiment.addData('trial.stopped', globalClock.getTime());
      // update the trial handler
      if (currentLoop instanceof MultiStairHandler) {
        currentLoop.addResponse(trial_resp.corr, level);
      }
      psychoJS.experiment.addData('trial_resp.keys', trial_resp.keys);
      if (typeof trial_resp.keys !== 'undefined') {  // we had a response
          psychoJS.experiment.addData('trial_resp.rt', trial_resp.rt);
          psychoJS.experiment.addData('trial_resp.duration', trial_resp.duration);
          }
      
      trial_resp.stop();
      // Run 'End Routine' code from trial_data_code
      var response_key = '';
      var response_rt_s = '';
      var response_rt_ms = '';
      var response_made = false;
      
      if (typeof trial_resp.keys !== 'undefined' && trial_resp.keys !== null && trial_resp.keys !== '') {
        response_key = trial_resp.keys;
        response_made = true;
      }
      
      if (typeof trial_resp.rt !== 'undefined' && trial_resp.rt !== null && trial_resp.rt !== '') {
        response_rt_s = trial_resp.rt;
        var parsedRt = Number.parseFloat(trial_resp.rt);
        response_rt_ms = Number.isFinite(parsedRt) ? Math.round(parsedRt * 1000000) / 1000 : '';
      }
      
      var expected = String(expectedResponse) === '1';
      var dummy = String(isDummy) === '1';
      var response_correct = '';
      if (dummy) {
        response_correct = '';
      } else if (expected && response_made) {
        response_correct = 1;
      } else if (expected && !response_made) {
        response_correct = 0;
      } else if ((!expected) && response_made) {
        response_correct = 0;
      } else {
        response_correct = 1;
      }
      
      var nbackRow = {
        session_id: nbackSessionId,
        task_name: NBACK_TASK_NAME,
        n_level: NBACK_LEVEL,
        blockType: nbackAsString(blockType),
        blockLabel: nbackAsString(blockLabel),
        blockOrderIndex: nbackAsInt(blockOrderIndex),
        trialNumber: nbackAsInt(trialNumber),
        scoredTrialIndex: nbackAsString(scoredTrialIndex),
        relationType: nbackAsString(relationType),
        relationLabel: nbackAsString(relationLabel),
        stimulus: nbackAsString(stimulus),
        stimulusRole: nbackAsString(stimulusRole),
        combination: nbackAsString(combination),
        position: nbackAsString(position),
        isDummy: nbackAsString(isDummy),
        isTarget: nbackAsString(isTarget),
        expectedResponse: nbackAsString(expectedResponse),
        coranswer: nbackAsString(coranswer),
        condition: nbackAsString(condition),
        Attribute1: nbackAsString(Attribute1),
        status: nbackAsString(status),
        response_key: response_key,
        response_rt_s: response_rt_s,
        response_rt_ms: response_rt_ms,
        response_made: response_made ? 1 : 0,
        response_correct: response_correct,
        measured_frame_rate_hz: nbackSafeValue(expInfo['measuredFrameRate']),
        timing_frame_rate_hz: nbackSafeValue(expInfo['timingFrameRate']),
        timing_hz: nbackSafeValue(expInfo['timingHz']),
        timing_source: nbackAsString(expInfo['timingSource']),
        requested_refresh_rate_hz: nbackAsString(expInfo['refresh_rate']),
        fixation_ms: NBACK_FIXATION_MS,
        stimulus_ms: NBACK_STIMULUS_MS,
        response_window_ms: NBACK_RESPONSE_WINDOW_MS
      };
      nbackRows.push(nbackRow);
      
      psychoJS.experiment.addData('session_id', nbackSessionId);
      psychoJS.experiment.addData('task_name', NBACK_TASK_NAME);
      psychoJS.experiment.addData('student_id', nbackAsString(expInfo['student_id']));
      psychoJS.experiment.addData('gender', nbackAsString(expInfo['gender']));
      psychoJS.experiment.addData('nationality', nbackAsString(expInfo['nationality']));
      psychoJS.experiment.addData('age', nbackAsString(expInfo['age']));
      psychoJS.experiment.addData('education', nbackAsString(expInfo['education']));
      psychoJS.experiment.addData('session_label', nbackAsString(expInfo['session_label']));
      psychoJS.experiment.addData('response_key', response_key);
      psychoJS.experiment.addData('response_rt_s', response_rt_s);
      psychoJS.experiment.addData('response_rt_ms', response_rt_ms);
      psychoJS.experiment.addData('response_made', response_made ? 1 : 0);
      psychoJS.experiment.addData('response_correct', response_correct);
      psychoJS.experiment.addData('measured_frame_rate_hz', nbackSafeValue(expInfo['measuredFrameRate']));
      psychoJS.experiment.addData('timing_frame_rate_hz', nbackSafeValue(expInfo['timingFrameRate']));
      psychoJS.experiment.addData('timing_hz', nbackSafeValue(expInfo['timingHz']));
      psychoJS.experiment.addData('timing_source', nbackAsString(expInfo['timingSource']));
      psychoJS.experiment.addData('requested_refresh_rate_hz', nbackAsString(expInfo['refresh_rate']));
      psychoJS.experiment.addData('response_window_ms', NBACK_RESPONSE_WINDOW_MS);
      
      // the Routine "trial" was not non-slip safe, so reset the non-slip timer
      routineTimer.reset();
      
      // Routines running outside a loop should always advance the datafile row
      if (currentLoop === psychoJS.experiment) {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  }
  
  
var main_startMaxDurationReached;
var _main_start_key_allKeys;
var main_startMaxDuration;
var main_startComponents;
function main_startRoutineBegin(snapshot) {
    return async function () {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
      
      //--- Prepare to start Routine 'main_start' ---
      t = 0;
      frameN = -1;
      continueRoutine = true; // until we're told otherwise
      // keep track of whether this Routine was forcibly ended
      routineForceEnded = false;
      main_startClock.reset();
      routineTimer.reset();
      main_startMaxDurationReached = false;
      // update component parameters for each repeat
      main_start_key.keys = undefined;
      main_start_key.rt = undefined;
      _main_start_key_allKeys = [];
      psychoJS.experiment.addData('main_start.started', globalClock.getTime());
      main_startMaxDuration = null
      // keep track of which components have finished
      main_startComponents = [];
      main_startComponents.push(main_start_text);
      main_startComponents.push(main_start_key);
      
      main_startComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent)
          thisComponent.status = PsychoJS.Status.NOT_STARTED;
         });
      return Scheduler.Event.NEXT;
    }
  }
  
  
function main_startRoutineEachFrame() {
    return async function () {
      //--- Loop for each frame of Routine 'main_start' ---
      // get current time
      t = main_startClock.getTime();
      frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
      // update/draw components on each frame
      
      // *main_start_text* updates
      if (t >= 0.0 && main_start_text.status === PsychoJS.Status.NOT_STARTED) {
        // keep track of start time/frame for later
        main_start_text.tStart = t;  // (not accounting for frame time here)
        main_start_text.frameNStart = frameN;  // exact frame index
        
        main_start_text.setAutoDraw(true);
      }
      
      
      // if main_start_text is active this frame...
      if (main_start_text.status === PsychoJS.Status.STARTED) {
      }
      
      
      // *main_start_key* updates
      if (t >= 0.2 && main_start_key.status === PsychoJS.Status.NOT_STARTED) {
        // keep track of start time/frame for later
        main_start_key.tStart = t;  // (not accounting for frame time here)
        main_start_key.frameNStart = frameN;  // exact frame index
        
        // keyboard checking is just starting
        psychoJS.window.callOnFlip(function() { main_start_key.clock.reset(); });  // t=0 on next screen flip
        psychoJS.window.callOnFlip(function() { main_start_key.start(); }); // start on screen flip
        psychoJS.window.callOnFlip(function() { main_start_key.clearEvents(); });
      }
      
      // if main_start_key is active this frame...
      if (main_start_key.status === PsychoJS.Status.STARTED) {
        let theseKeys = main_start_key.getKeys({keyList: 'space', waitRelease: false});
        _main_start_key_allKeys = _main_start_key_allKeys.concat(theseKeys);
        if (_main_start_key_allKeys.length > 0) {
          main_start_key.keys = _main_start_key_allKeys[_main_start_key_allKeys.length - 1].name;  // just the last key pressed
          main_start_key.rt = _main_start_key_allKeys[_main_start_key_allKeys.length - 1].rt;
          main_start_key.duration = _main_start_key_allKeys[_main_start_key_allKeys.length - 1].duration;
          // a response ends the routine
          continueRoutine = false;
        }
      }
      
      // check for quit (typically the Esc key)
      if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
        return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
      }
      
      // check if the Routine should terminate
      if (!continueRoutine) {  // a component has requested a forced-end of Routine
        routineForceEnded = true;
        return Scheduler.Event.NEXT;
      }
      
      continueRoutine = false;  // reverts to True if at least one component still running
      main_startComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
          continueRoutine = true;
        }
      });
      
      // refresh the screen if continuing
      if (continueRoutine) {
        return Scheduler.Event.FLIP_REPEAT;
      } else {
        return Scheduler.Event.NEXT;
      }
    };
  }
  
  
function main_startRoutineEnd(snapshot) {
    return async function () {
      //--- Ending Routine 'main_start' ---
      main_startComponents.forEach( function(thisComponent) {
        if (typeof thisComponent.setAutoDraw === 'function') {
          thisComponent.setAutoDraw(false);
        }
      });
      psychoJS.experiment.addData('main_start.stopped', globalClock.getTime());
      // update the trial handler
      if (currentLoop instanceof MultiStairHandler) {
        currentLoop.addResponse(main_start_key.corr, level);
      }
      psychoJS.experiment.addData('main_start_key.keys', main_start_key.keys);
      if (typeof main_start_key.keys !== 'undefined') {  // we had a response
          psychoJS.experiment.addData('main_start_key.rt', main_start_key.rt);
          psychoJS.experiment.addData('main_start_key.duration', main_start_key.duration);
          routineTimer.reset();
          }
      
      main_start_key.stop();
      // the Routine "main_start" was not non-slip safe, so reset the non-slip timer
      routineTimer.reset();
      
      // Routines running outside a loop should always advance the datafile row
      if (currentLoop === psychoJS.experiment) {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  }
  
  
var break_screenMaxDurationReached;
var _break_screen_key_allKeys;
var break_screenMaxDuration;
var break_screenComponents;
function break_screenRoutineBegin(snapshot) {
    return async function () {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
      
      //--- Prepare to start Routine 'break_screen' ---
      t = 0;
      frameN = -1;
      continueRoutine = true; // until we're told otherwise
      // keep track of whether this Routine was forcibly ended
      routineForceEnded = false;
      break_screenClock.reset();
      routineTimer.reset();
      break_screenMaxDurationReached = false;
      // update component parameters for each repeat
      break_screen_key.keys = undefined;
      break_screen_key.rt = undefined;
      _break_screen_key_allKeys = [];
      // Run 'Begin Routine' code from break_gate
      if (String(breakAfter) !== '1') {
        continueRoutine = false;
      }
      psychoJS.experiment.addData('break_screen.started', globalClock.getTime());
      break_screenMaxDuration = null
      // keep track of which components have finished
      break_screenComponents = [];
      break_screenComponents.push(break_screen_text);
      break_screenComponents.push(break_screen_key);
      
      break_screenComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent)
          thisComponent.status = PsychoJS.Status.NOT_STARTED;
         });
      return Scheduler.Event.NEXT;
    }
  }
  
  
function break_screenRoutineEachFrame() {
    return async function () {
      //--- Loop for each frame of Routine 'break_screen' ---
      // get current time
      t = break_screenClock.getTime();
      frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
      // update/draw components on each frame
      
      // *break_screen_text* updates
      if (t >= 0.0 && break_screen_text.status === PsychoJS.Status.NOT_STARTED) {
        // keep track of start time/frame for later
        break_screen_text.tStart = t;  // (not accounting for frame time here)
        break_screen_text.frameNStart = frameN;  // exact frame index
        
        break_screen_text.setAutoDraw(true);
      }
      
      
      // if break_screen_text is active this frame...
      if (break_screen_text.status === PsychoJS.Status.STARTED) {
      }
      
      
      // *break_screen_key* updates
      if (t >= 0.2 && break_screen_key.status === PsychoJS.Status.NOT_STARTED) {
        // keep track of start time/frame for later
        break_screen_key.tStart = t;  // (not accounting for frame time here)
        break_screen_key.frameNStart = frameN;  // exact frame index
        
        // keyboard checking is just starting
        psychoJS.window.callOnFlip(function() { break_screen_key.clock.reset(); });  // t=0 on next screen flip
        psychoJS.window.callOnFlip(function() { break_screen_key.start(); }); // start on screen flip
        psychoJS.window.callOnFlip(function() { break_screen_key.clearEvents(); });
      }
      
      // if break_screen_key is active this frame...
      if (break_screen_key.status === PsychoJS.Status.STARTED) {
        let theseKeys = break_screen_key.getKeys({keyList: 'space', waitRelease: false});
        _break_screen_key_allKeys = _break_screen_key_allKeys.concat(theseKeys);
        if (_break_screen_key_allKeys.length > 0) {
          break_screen_key.keys = _break_screen_key_allKeys[_break_screen_key_allKeys.length - 1].name;  // just the last key pressed
          break_screen_key.rt = _break_screen_key_allKeys[_break_screen_key_allKeys.length - 1].rt;
          break_screen_key.duration = _break_screen_key_allKeys[_break_screen_key_allKeys.length - 1].duration;
          // a response ends the routine
          continueRoutine = false;
        }
      }
      
      // check for quit (typically the Esc key)
      if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
        return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
      }
      
      // check if the Routine should terminate
      if (!continueRoutine) {  // a component has requested a forced-end of Routine
        routineForceEnded = true;
        return Scheduler.Event.NEXT;
      }
      
      continueRoutine = false;  // reverts to True if at least one component still running
      break_screenComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
          continueRoutine = true;
        }
      });
      
      // refresh the screen if continuing
      if (continueRoutine) {
        return Scheduler.Event.FLIP_REPEAT;
      } else {
        return Scheduler.Event.NEXT;
      }
    };
  }
  
  
function break_screenRoutineEnd(snapshot) {
    return async function () {
      //--- Ending Routine 'break_screen' ---
      break_screenComponents.forEach( function(thisComponent) {
        if (typeof thisComponent.setAutoDraw === 'function') {
          thisComponent.setAutoDraw(false);
        }
      });
      psychoJS.experiment.addData('break_screen.stopped', globalClock.getTime());
      // update the trial handler
      if (currentLoop instanceof MultiStairHandler) {
        currentLoop.addResponse(break_screen_key.corr, level);
      }
      psychoJS.experiment.addData('break_screen_key.keys', break_screen_key.keys);
      if (typeof break_screen_key.keys !== 'undefined') {  // we had a response
          psychoJS.experiment.addData('break_screen_key.rt', break_screen_key.rt);
          psychoJS.experiment.addData('break_screen_key.duration', break_screen_key.duration);
          routineTimer.reset();
          }
      
      break_screen_key.stop();
      // the Routine "break_screen" was not non-slip safe, so reset the non-slip timer
      routineTimer.reset();
      
      // Routines running outside a loop should always advance the datafile row
      if (currentLoop === psychoJS.experiment) {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  }
  
  
var endMaxDurationReached;
var _end_key_allKeys;
var endMaxDuration;
var endComponents;
function endRoutineBegin(snapshot) {
    return async function () {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
      
      //--- Prepare to start Routine 'end' ---
      t = 0;
      frameN = -1;
      continueRoutine = true; // until we're told otherwise
      // keep track of whether this Routine was forcibly ended
      routineForceEnded = false;
      endClock.reset();
      routineTimer.reset();
      endMaxDurationReached = false;
      // update component parameters for each repeat
      end_key.keys = undefined;
      end_key.rt = undefined;
      _end_key_allKeys = [];
      psychoJS.experiment.addData('end.started', globalClock.getTime());
      endMaxDuration = null
      // keep track of which components have finished
      endComponents = [];
      endComponents.push(end_text);
      endComponents.push(end_key);
      
      endComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent)
          thisComponent.status = PsychoJS.Status.NOT_STARTED;
         });
      return Scheduler.Event.NEXT;
    }
  }
  
  
function endRoutineEachFrame() {
    return async function () {
      //--- Loop for each frame of Routine 'end' ---
      // get current time
      t = endClock.getTime();
      frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
      // update/draw components on each frame
      
      // *end_text* updates
      if (t >= 0.0 && end_text.status === PsychoJS.Status.NOT_STARTED) {
        // keep track of start time/frame for later
        end_text.tStart = t;  // (not accounting for frame time here)
        end_text.frameNStart = frameN;  // exact frame index
        
        end_text.setAutoDraw(true);
      }
      
      
      // if end_text is active this frame...
      if (end_text.status === PsychoJS.Status.STARTED) {
      }
      
      
      // *end_key* updates
      if (t >= 0.2 && end_key.status === PsychoJS.Status.NOT_STARTED) {
        // keep track of start time/frame for later
        end_key.tStart = t;  // (not accounting for frame time here)
        end_key.frameNStart = frameN;  // exact frame index
        
        // keyboard checking is just starting
        psychoJS.window.callOnFlip(function() { end_key.clock.reset(); });  // t=0 on next screen flip
        psychoJS.window.callOnFlip(function() { end_key.start(); }); // start on screen flip
        psychoJS.window.callOnFlip(function() { end_key.clearEvents(); });
      }
      
      // if end_key is active this frame...
      if (end_key.status === PsychoJS.Status.STARTED) {
        let theseKeys = end_key.getKeys({keyList: 'space', waitRelease: false});
        _end_key_allKeys = _end_key_allKeys.concat(theseKeys);
        if (_end_key_allKeys.length > 0) {
          end_key.keys = _end_key_allKeys[_end_key_allKeys.length - 1].name;  // just the last key pressed
          end_key.rt = _end_key_allKeys[_end_key_allKeys.length - 1].rt;
          end_key.duration = _end_key_allKeys[_end_key_allKeys.length - 1].duration;
          // a response ends the routine
          continueRoutine = false;
        }
      }
      
      // check for quit (typically the Esc key)
      if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
        return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
      }
      
      // check if the Routine should terminate
      if (!continueRoutine) {  // a component has requested a forced-end of Routine
        routineForceEnded = true;
        return Scheduler.Event.NEXT;
      }
      
      continueRoutine = false;  // reverts to True if at least one component still running
      endComponents.forEach( function(thisComponent) {
        if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
          continueRoutine = true;
        }
      });
      
      // refresh the screen if continuing
      if (continueRoutine) {
        return Scheduler.Event.FLIP_REPEAT;
      } else {
        return Scheduler.Event.NEXT;
      }
    };
  }
  
  
function endRoutineEnd(snapshot) {
    return async function () {
      //--- Ending Routine 'end' ---
      endComponents.forEach( function(thisComponent) {
        if (typeof thisComponent.setAutoDraw === 'function') {
          thisComponent.setAutoDraw(false);
        }
      });
      psychoJS.experiment.addData('end.stopped', globalClock.getTime());
      // update the trial handler
      if (currentLoop instanceof MultiStairHandler) {
        currentLoop.addResponse(end_key.corr, level);
      }
      psychoJS.experiment.addData('end_key.keys', end_key.keys);
      if (typeof end_key.keys !== 'undefined') {  // we had a response
          psychoJS.experiment.addData('end_key.rt', end_key.rt);
          psychoJS.experiment.addData('end_key.duration', end_key.duration);
          routineTimer.reset();
          }
      
      end_key.stop();
      var nbackSubmitResult = await nbackSubmitResults(true);
      psychoJS.experiment.addData('server_upload_ok', nbackSubmitResult.ok ? 1 : 0);
      psychoJS.experiment.addData('server_upload_status', nbackSubmitResult.status);
      if (nbackSubmitResult.error) {
        psychoJS.experiment.addData('server_upload_error', nbackSubmitResult.error);
      }
      nbackDownloadCsv();
      
      // the Routine "end" was not non-slip safe, so reset the non-slip timer
      routineTimer.reset();
      
      // Routines running outside a loop should always advance the datafile row
      if (currentLoop === psychoJS.experiment) {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  }
  
  
function importConditions(currentLoop) {
    return async function () {
      psychoJS.importAttributes(currentLoop.getCurrentTrial());
      return Scheduler.Event.NEXT;
      };
  }
  
  
async function quitPsychoJS(message, isCompleted) {
    // Check for and save orphaned data
    if (psychoJS.experiment.isEntryEmpty()) {
      psychoJS.experiment.nextEntry();
    }
    psychoJS.window.close();
    psychoJS.quit({message: message, isCompleted: isCompleted});
    
    return Scheduler.Event.QUIT;
  }
