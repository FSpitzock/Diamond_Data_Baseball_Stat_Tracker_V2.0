import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import BaseballAI from "./pages/BaseballAI";
import BaseballCard from "./pages/BaseballCard";
import NotFound from "./pages/NotFound";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import '../src/App.css';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // your Apollo Server URL
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}> {/* Step 2: Wrap app in ApolloProvider */}
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Stats" element={<Stats />} />
          <Route path="/BaseballAI" element={<BaseballAI />} />
          <Route path="/BaseballCard" element={<BaseballCard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
