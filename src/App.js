import React, {useState} from 'react';
import './App.css';
import ResumeInput from './components/resume-input'
import JobInput from './components/job-input'
import SkillTable from './components/skill-table'
import {compare} from './compare/compare'

function App() {
  const [resume, changeResume] = useState("")
  const [job, changeJob] = useState("")
  const [skillSet, changeSkillSet] = useState([])
  const [isEditingJob, setIsEditingJob] = useState(true)

  const checkHandler = () => {
    setIsEditingJob(!isEditingJob)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const skillSet = compare(resume, job)
    changeSkillSet(skillSet)
    setIsEditingJob(false)
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && event.metaKey) {
      const skillSet = compare(resume, job)
      changeSkillSet(skillSet)
      setIsEditingJob(false)
    }
  }

  const getMissingKeywords = () => {
    const skills = skillSet.filter((x) => { return x.resume === 0 })
    return skills
  }

  function formatJob() {
    const brString = job.replace(/\n/g, "<br />")
    const missingKeywords = getMissingKeywords()

    const reducer = (acc, curr) => acc.replace(curr.skill, `<strong>${curr.skill}</strong>`)
     
    return missingKeywords.reduce(reducer, brString)
  }

  return (
    <div className="App">
      <div className="contents">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="top">
            <button id="submit" type="submit">Check Resume</button>
            <div className="hidden-text-container">
              <span className={resume || job ? "visible-text" : "hidden-text"}>
                Or submit with <em>&lt;CMD&gt;-&lt;Enter&gt;</em> or <em>&lt;Win&gt;-&lt;Enter&gt;</em>
              </span>
            </div>
          </div>
          <div className="main">
            <div className="input-container">
              <ResumeInput changeResume={changeResume} resume={resume}/>
              <div>
                <button className="toggle" type="button">
                  <input
                    style={{ display: "none" }}
                    type="checkbox"
                    id="checkbox"
                    checked={isEditingJob}
                    onChange={checkHandler}
                  />
                  <label htmlFor="checkbox">{isEditingJob ? "Highlight Keywords" : "Edit Job"}</label>
                </button>
              </div>
              {
                isEditingJob ? <JobInput changeJob={changeJob} job={job} skills={skillSet} />
                  : <div className='preview-container'>
                    <p className="job-text" dangerouslySetInnerHTML={{ __html: formatJob() }}></p>
                  </div>
              }
            </div>
            <div className="skill-table">
              <SkillTable skills={skillSet} />
            </div>
          </div>
          <div className="extras">
            <span onClick={() => getMissingKeywords()}>Placeholder for extras</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
