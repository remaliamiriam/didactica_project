import React from "react";
import theoryData from "../data/resurseTheory.json";
import "./ResourcesPage.css";

const ResourcesPage = () => {
  const data = theoryData.evaluation_instrument_development;

  const handleScroll = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    const panel = document.querySelector('.glass-panel');
    if (section && panel) {
      const sectionTop = section.offsetTop;
      panel.scrollTo({
        top: sectionTop - 20, // offset mic ca să nu fie lipit de margine
        behavior: "smooth",
      });
    }
  };

  const formatParagraphs = (text) => {
    return text.split("\n").map((para, idx) => (
      <p key={idx} className="chapter-paragraph">
        {para}
      </p>
    ));
  };

  return (
    <div className="resources-container">
      <h1 className="resources-title">Dezvoltarea instrumentului de evaluare</h1>

      <div className="glass-panel custom-scrollbar">
        <nav className="toc-container">
          <h2 className="toc-title">Cuprins</h2>
          <ul className="toc-list">
            {data.chapters.map((chapter, idx) => (
              <li key={idx} className="toc-item">
                <a
                  href={`#chapter-${idx}`}
                  onClick={(e) => handleScroll(e, `chapter-${idx}`)}
                  className="toc-link"
                >
                  {chapter.title}
                </a>
              </li>
            ))}
            <li className="toc-item">
              <a
                href="#key-concepts"
                onClick={(e) => handleScroll(e, "key-concepts")}
                className="toc-link"
              >
                Concepte cheie
              </a>
            </li>
            <li className="toc-item">
              <a
                href="#references"
                onClick={(e) => handleScroll(e, "references")}
                className="toc-link"
              >
                Bibliografie
              </a>
            </li>
          </ul>
        </nav>

        {data.chapters.map((chapter, idx) => (
          <section id={`chapter-${idx}`} key={idx} className="chapter-section">
            <h2 className="chapter-title">{chapter.title}</h2>
            <div className="chapter-content">
              {formatParagraphs(chapter.content)}
            </div>
          </section>
        ))}

        <section id="key-concepts" className="key-concepts-section">
          <h2 className="key-concepts-title">Concepte cheie</h2>
          <ul className="key-concepts-list">
            {Object.entries(data.key_concepts).map(([key, value], idx) => (
              <li key={idx} className="key-concept-item">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}:</strong> {value}
              </li>
            ))}
          </ul>
        </section>

        <section id="references" className="references-section">
          <h2 className="references-title">Bibliografie</h2>
          <ul className="references-list">
            {data.references.map((ref, idx) => (
              <li key={idx} className="reference-item">{ref}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ResourcesPage;
